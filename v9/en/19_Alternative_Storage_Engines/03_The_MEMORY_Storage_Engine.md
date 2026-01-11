## 18.3 The MEMORY Storage Engine

The `MEMORY` storage engine (formerly known as `HEAP`) creates special-purpose tables with contents that are stored in memory. Because the data is vulnerable to crashes, hardware issues, or power outages, only use these tables as temporary work areas or read-only caches for data pulled from other tables.

**Table 18.4 MEMORY Storage Engine Features**

<table frame="box" rules="all" summary="Features supported by the MEMORY storage engine."><thead><tr><th>Feature</th> <th>Support</th> </tr></thead><tbody><tr><td><span><strong>B-tree indexes</strong></span></td> <td>Yes</td> </tr><tr><td><span><strong>Backup/point-in-time recovery</strong></span> (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td><span><strong>Cluster database support</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Clustered indexes</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Compressed data</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Data caches</strong></span></td> <td>N/A</td> </tr><tr><td><span><strong>Encrypted data</strong></span></td> <td>Yes (Implemented in the server via encryption functions.)</td> </tr><tr><td><span><strong>Foreign key support</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Full-text search indexes</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Geospatial data type support</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Geospatial indexing support</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Hash indexes</strong></span></td> <td>Yes</td> </tr><tr><td><span><strong>Index caches</strong></span></td> <td>N/A</td> </tr><tr><td><span><strong>Locking granularity</strong></span></td> <td>Table</td> </tr><tr><td><span><strong>MVCC</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Replication support</strong></span> (Implemented in the server, rather than in the storage engine.)</td> <td>Limited (See the discussion later in this section.)</td> </tr><tr><td><span><strong>Storage limits</strong></span></td> <td>RAM</td> </tr><tr><td><span><strong>T-tree indexes</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Transactions</strong></span></td> <td>No</td> </tr><tr><td><span><strong>Update statistics for data dictionary</strong></span></td> <td>Yes</td> </tr></tbody></table>

* When to Use MEMORY or NDB Cluster
* Partitioning
* Performance Characteristics
* Characteristics of MEMORY Tables
* DDL Operations for MEMORY Tables
* Indexes
* User-Created and Temporary Tables
* Loading Data
* MEMORY Tables and Replication
* Managing Memory Use
* Additional Resources

### When to Use MEMORY or NDB Cluster

Developers looking to deploy applications that use the `MEMORY` storage engine for important, highly available, or frequently updated data should consider whether NDB Cluster is a better choice. A typical use case for the `MEMORY` engine involves these characteristics:

* Operations involving transient, non-critical data such as session management or caching. When the MySQL server halts or restarts, the data in `MEMORY` tables is lost.

* In-memory storage for fast access and low latency. Data volume can fit entirely in memory without causing the operating system to swap out virtual memory pages.

* A read-only or read-mostly data access pattern (limited updates).

NDB Cluster offers the same features as the `MEMORY` engine with higher performance levels, and provides additional features not available with `MEMORY`:

* Row-level locking and multiple-thread operation for low contention between clients.

* Scalability even with statement mixes that include writes.
* Optional disk-backed operation for data durability.
* Shared-nothing architecture and multiple-host operation with no single point of failure, enabling 99.999% availability.

* Automatic data distribution across nodes; application developers need not craft custom sharding or partitioning solutions.

* Support for variable-length data types (including `BLOB` and `TEXT`) not supported by `MEMORY`.

### Partitioning

`MEMORY` tables cannot be partitioned.

### Performance Characteristics

`MEMORY` performance is constrained by contention resulting from single-thread execution and table lock overhead when processing updates. This limits scalability when load increases, particularly for statement mixes that include writes.

Despite the in-memory processing for `MEMORY` tables, they are not necessarily faster than `InnoDB` tables on a busy server, for general-purpose queries, or under a read/write workload. In particular, the table locking involved with performing updates can slow down concurrent usage of `MEMORY` tables from multiple sessions.

Depending on the kinds of queries performed on a `MEMORY` table, you might create indexes as either the default hash data structure (for looking up single values based on a unique key), or a general-purpose B-tree data structure (for all kinds of queries involving equality, inequality, or range operators such as less than or greater than). The following sections illustrate the syntax for creating both kinds of indexes. A common performance issue is using the default hash indexes in workloads where B-tree indexes are more efficient.

### Characteristics of MEMORY Tables

The `MEMORY` storage engine does not create any files on disk. The table definition is stored in the MySQL data dictionary.

`MEMORY` tables have the following characteristics:

* Space for `MEMORY` tables is allocated in small blocks. Tables use 100% dynamic hashing for inserts. No overflow area or extra key space is needed. No extra space is needed for free lists. Deleted rows are put in a linked list and are reused when you insert new data into the table. `MEMORY` tables also have none of the problems commonly associated with deletes plus inserts in hashed tables.

* `MEMORY` tables use a fixed-length row-storage format. Variable-length types such as `VARCHAR` are stored using a fixed length.

* `MEMORY` tables cannot contain `BLOB` or `TEXT` columns.

* `MEMORY` includes support for `AUTO_INCREMENT` columns.

* Non-`TEMPORARY` `MEMORY` tables are shared among all clients, just like any other non-`TEMPORARY` table.

### DDL Operations for MEMORY Tables

To create a `MEMORY` table, specify the clause `ENGINE=MEMORY` on the `CREATE TABLE` statement.

```
CREATE TABLE t (i INT) ENGINE = MEMORY;
```

As indicated by the engine name, `MEMORY` tables are stored in memory. They use hash indexes by default, which makes them very fast for single-value lookups, and very useful for creating temporary tables. However, when the server shuts down, all rows stored in `MEMORY` tables are lost. The tables themselves continue to exist because their definitions are stored in the MySQL data dictionary, but they are empty when the server restarts.

This example shows how you might create, use, and remove a `MEMORY` table:

```
mysql> CREATE TABLE test ENGINE=MEMORY
           SELECT ip,SUM(downloads) AS down
           FROM log_table GROUP BY ip;

mysql> SELECT COUNT(ip),AVG(down) FROM test;

mysql> DROP TABLE test;
```

The maximum size of `MEMORY` tables is limited by the `max_heap_table_size` system variable, which has a default value of 16MB. To enforce different size limits for `MEMORY` tables, change the value of this variable. The value in effect for `CREATE TABLE`, or a subsequent `ALTER TABLE` or `TRUNCATE TABLE`, is the value used for the life of the table. A server restart also sets the maximum size of existing `MEMORY` tables to the global `max_heap_table_size` value. You can set the size for individual tables as described later in this section.

### Indexes

The `MEMORY` storage engine supports both `HASH` and `BTREE` indexes. You can specify one or the other for a given index by adding a `USING` clause as shown here:

```
CREATE TABLE lookup
    (id INT, INDEX USING HASH (id))
    ENGINE = MEMORY;
CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id))
    ENGINE = MEMORY;
```

For general characteristics of B-tree and hash indexes, see Section 10.3.1, “How MySQL Uses Indexes”.

`MEMORY` tables can have up to 64 indexes per table, 16 columns per index and a maximum key length of 3072 bytes.

If a `MEMORY` table hash index has a high degree of key duplication (many index entries containing the same value), updates to the table that affect key values and all deletes are significantly slower. The degree of this slowdown is proportional to the degree of duplication (or, inversely proportional to the index cardinality). You can use a `BTREE` index to avoid this problem.

`MEMORY` tables can have nonunique keys. (This is an uncommon feature for implementations of hash indexes.)

Columns that are indexed can contain `NULL` values.

### User-Created and Temporary Tables

`MEMORY` table contents are stored in memory, which is a property that `MEMORY` tables share with internal temporary tables that the server creates on the fly while processing queries. However, the two types of tables differ in that `MEMORY` tables are not subject to storage conversion, whereas internal temporary tables are:

* If an internal temporary table becomes too large, the server automatically converts it to on-disk storage, as described in Section 10.4.4, “Internal Temporary Table Use in MySQL”.

* User-created `MEMORY` tables are never converted to disk tables.

### Loading Data

To populate a `MEMORY` table when the MySQL server starts, you can use the `init_file` system variable. For example, you can put statements such as `INSERT INTO ... SELECT` or `LOAD DATA` into a file to load the table from a persistent data source, and use `init_file` to name the file. See Section 7.1.8, “Server System Variables”, and Section 15.2.9, “LOAD DATA Statement”.

### MEMORY Tables and Replication

When a replication source server shuts down and restarts, its `MEMORY` tables become empty. To replicate this effect to replicas, the first time that the source uses a given `MEMORY` table after startup, it logs an event that notifies replicas that the table must be emptied by writing a `TRUNCATE TABLE` statement for that table to the binary log. When a replica server shuts down and restarts, its `MEMORY` tables also become empty, and it writes a `TRUNCATE TABLE` statement to its own binary log, which is passed on to any downstream replicas.

When you use `MEMORY` tables in a replication topology, in some situations, the table on the source and the table on the replica can differ. For information on handling each of these situations to prevent stale reads or errors, see Section 19.5.1.22, “Replication and MEMORY Tables”.

### Managing Memory Use

The server needs sufficient memory to maintain all `MEMORY` tables that are in use at the same time.

Memory is not reclaimed if you delete individual rows from a `MEMORY` table. Memory is reclaimed only when the entire table is deleted. Memory that was previously used for deleted rows is re-used for new rows within the same table. To free all the memory used by a `MEMORY` table when you no longer require its contents, execute `DELETE` or `TRUNCATE TABLE` to remove all rows, or remove the table altogether using `DROP TABLE`. To free up the memory used by deleted rows, use `ALTER TABLE ENGINE=MEMORY` to force a table rebuild.

The memory needed for one row in a `MEMORY` table is calculated using the following expression:

```
SUM_OVER_ALL_BTREE_KEYS(max_length_of_key + sizeof(char*) * 4)
+ SUM_OVER_ALL_HASH_KEYS(sizeof(char*) * 2)
+ ALIGN(length_of_row+1, sizeof(char*))
```

`ALIGN()` represents a round-up factor to cause the row length to be an exact multiple of the `char` pointer size. `sizeof(char*)` is 4 on 32-bit machines and 8 on 64-bit machines.

As mentioned earlier, the `max_heap_table_size` system variable sets the limit on the maximum size of `MEMORY` tables. To control the maximum size for individual tables, set the session value of this variable before creating each table. (Do not change the global `max_heap_table_size` value unless you intend the value to be used for `MEMORY` tables created by all clients.) The following example creates two `MEMORY` tables, with a maximum size of 1MB and 2MB, respectively:

```
mysql> SET max_heap_table_size = 1024*1024;
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t1 (id INT, UNIQUE(id)) ENGINE = MEMORY;
Query OK, 0 rows affected (0.01 sec)

mysql> SET max_heap_table_size = 1024*1024*2;
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t2 (id INT, UNIQUE(id)) ENGINE = MEMORY;
Query OK, 0 rows affected (0.00 sec)
```

Both tables revert to the server's global `max_heap_table_size` value if the server restarts.

You can also specify a `MAX_ROWS` table option in `CREATE TABLE` statements for `MEMORY` tables to provide a hint about the number of rows you plan to store in them. This does not enable the table to grow beyond the `max_heap_table_size` value, which still acts as a constraint on maximum table size. For maximum flexibility in being able to use `MAX_ROWS`, set `max_heap_table_size` at least as high as the value to which you want each `MEMORY` table to be able to grow.

### Additional Resources

A forum dedicated to the `MEMORY` storage engine is available at <https://forums.mysql.com/list.php?92>.
