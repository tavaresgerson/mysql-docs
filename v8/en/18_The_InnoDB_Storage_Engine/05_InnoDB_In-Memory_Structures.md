## 17.5 InnoDB In-Memory Structures

This section describes `InnoDB` in-memory structures and related topics.


### 17.5.1 Buffer Pool

The buffer pool is an area in main memory where `InnoDB` caches table and index data as it is accessed. The buffer pool permits frequently used data to be accessed directly from memory, which speeds up processing. On dedicated servers, up to 80% of physical memory is often assigned to the buffer pool.

For efficiency of high-volume read operations, the buffer pool is divided into pages that can potentially hold multiple rows. For efficiency of cache management, the buffer pool is implemented as a linked list of pages; data that is rarely used is aged out of the cache using a variation of the least recently used (LRU) algorithm.

Knowing how to take advantage of the buffer pool to keep frequently accessed data in memory is an important aspect of MySQL tuning.

#### Buffer Pool LRU Algorithm

The buffer pool is managed as a list using a variation of the LRU algorithm. When room is needed to add a new page to the buffer pool, the least recently used page is evicted and a new page is added to the middle of the list. This midpoint insertion strategy treats the list as two sublists:

* At the head, a sublist of new (“young”) pages that were accessed recently

* At the tail, a sublist of old pages that were accessed less recently

**Figure 17.2 Buffer Pool List**

![Content is described in the surrounding text.](images/innodb-buffer-pool-list.png)

The algorithm keeps frequently used pages in the new sublist. The old sublist contains less frequently used pages; these pages are candidates for eviction.

By default, the algorithm operates as follows:

* 3/8 of the buffer pool is devoted to the old sublist.
* The midpoint of the list is the boundary where the tail of the new sublist meets the head of the old sublist.

* When `InnoDB` reads a page into the buffer pool, it initially inserts it at the midpoint (the head of the old sublist). A page can be read because it is required for a user-initiated operation such as an SQL query, or as part of a read-ahead operation performed automatically by `InnoDB`.

* Accessing a page in the old sublist makes it “young”, moving it to the head of the new sublist. If the page was read because it was required by a user-initiated operation, the first access occurs immediately and the page is made young. If the page was read due to a read-ahead operation, the first access does not occur immediately and might not occur at all before the page is evicted.

* As the database operates, pages in the buffer pool that are not accessed “age” by moving toward the tail of the list. Pages in both the new and old sublists age as other pages are made new. Pages in the old sublist also age as pages are inserted at the midpoint. Eventually, a page that remains unused reaches the tail of the old sublist and is evicted.

By default, pages read by queries are immediately moved into the new sublist, meaning they stay in the buffer pool longer. A table scan, performed for a **mysqldump** operation or a `SELECT` statement with no `WHERE` clause, for example, can bring a large amount of data into the buffer pool and evict an equivalent amount of older data, even if the new data is never used again. Similarly, pages that are loaded by the read-ahead background thread and accessed only once are moved to the head of the new list. These situations can push frequently used pages to the old sublist where they become subject to eviction. For information about optimizing this behavior, see Section 17.8.3.3, “Making the Buffer Pool Scan Resistant”, and Section 17.8.3.4, “Configuring InnoDB Buffer Pool Prefetching (Read-Ahead)”").

`InnoDB` Standard Monitor output contains several fields in the `BUFFER POOL AND MEMORY` section regarding operation of the buffer pool LRU algorithm. For details, see Monitoring the Buffer Pool Using the InnoDB Standard Monitor.

#### Buffer Pool Configuration

You can configure the various aspects of the buffer pool to improve performance.

* Ideally, you set the size of the buffer pool to as large a value as practical, leaving enough memory for other processes on the server to run without excessive paging. The larger the buffer pool, the more `InnoDB` acts like an in-memory database, reading data from disk once and then accessing the data from memory during subsequent reads. See Section 17.8.3.1, “Configuring InnoDB Buffer Pool Size”.

* On 64-bit systems with sufficient memory, you can split the buffer pool into multiple parts to minimize contention for memory structures among concurrent operations. For details, see Section 17.8.3.2, “Configuring Multiple Buffer Pool Instances”.

* You can keep frequently accessed data in memory regardless of sudden spikes of activity from operations that would bring large amounts of infrequently accessed data into the buffer pool. For details, see Section 17.8.3.3, “Making the Buffer Pool Scan Resistant”.

* You can control how and when to perform read-ahead requests to prefetch pages into the buffer pool asynchronously in anticipation of impending need for them. For details, see Section 17.8.3.4, “Configuring InnoDB Buffer Pool Prefetching (Read-Ahead)”").

* You can control when background flushing occurs and whether or not the rate of flushing is dynamically adjusted based on workload. For details, see Section 17.8.3.5, “Configuring Buffer Pool Flushing”.

* You can configure how `InnoDB` preserves the current buffer pool state to avoid a lengthy warmup period after a server restart. For details, see Section 17.8.3.6, “Saving and Restoring the Buffer Pool State”.

#### Monitoring the Buffer Pool Using the InnoDB Standard Monitor

`InnoDB` Standard Monitor output, which can be accessed using [`SHOW ENGINE INNODB STATUS`](innodb-standard-monitor.html "17.17.3 InnoDB Standard Monitor and Lock Monitor Output"), provides metrics regarding operation of the buffer pool. Buffer pool metrics are located in the `BUFFER POOL AND MEMORY` section of `InnoDB` Standard Monitor output:

```
----------------------
BUFFER POOL AND MEMORY
----------------------
Total large memory allocated 2198863872
Dictionary memory allocated 776332
Buffer pool size   131072
Free buffers       124908
Database pages     5720
Old database pages 2071
Modified db pages  910
Pending reads 0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 4, not young 0
0.10 youngs/s, 0.00 non-youngs/s
Pages read 197, created 5523, written 5060
0.00 reads/s, 190.89 creates/s, 244.94 writes/s
Buffer pool hit rate 1000 / 1000, young-making rate 0 / 1000 not
0 / 1000
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read
ahead 0.00/s
LRU len: 5720, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
```

The following table describes buffer pool metrics reported by the `InnoDB` Standard Monitor.

Per second averages provided in `InnoDB` Standard Monitor output are based on the elapsed time since `InnoDB` Standard Monitor output was last printed.

**Table 17.2 InnoDB Buffer Pool Metrics**

<table summary="InnoDB buffer pool metrics reported by the InnoDB Standard Monitor."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Name</th> <th>Description</th> </tr></thead><tbody><tr> <td>Total memory allocated</td> <td>The total memory allocated for the buffer pool in bytes.</td> </tr><tr> <td>Dictionary memory allocated</td> <td>The total memory allocated for the <code>InnoDB</code> data dictionary in bytes.</td> </tr><tr> <td>Buffer pool size</td> <td>The total size in pages allocated to the buffer pool.</td> </tr><tr> <td>Free buffers</td> <td>The total size in pages of the buffer pool free list.</td> </tr><tr> <td>Database pages</td> <td>The total size in pages of the buffer pool LRU list.</td> </tr><tr> <td>Old database pages</td> <td>The total size in pages of the buffer pool old LRU sublist.</td> </tr><tr> <td>Modified db pages</td> <td>The current number of pages modified in the buffer pool.</td> </tr><tr> <td>Pending reads</td> <td>The number of buffer pool pages waiting to be read into the buffer pool.</td> </tr><tr> <td>Pending writes LRU</td> <td>The number of old dirty pages within the buffer pool to be written from the bottom of the LRU list.</td> </tr><tr> <td>Pending writes flush list</td> <td>The number of buffer pool pages to be flushed during checkpointing.</td> </tr><tr> <td>Pending writes single page</td> <td>The number of pending independent page writes within the buffer pool.</td> </tr><tr> <td>Pages made young</td> <td>The total number of pages made young in the buffer pool LRU list (moved to the head of sublist of “new” pages).</td> </tr><tr> <td>Pages made not young</td> <td>The total number of pages not made young in the buffer pool LRU list (pages that have remained in the “old” sublist without being made young).</td> </tr><tr> <td>youngs/s</td> <td>The per second average of accesses to old pages in the buffer pool LRU list that have resulted in making pages young. See the notes that follow this table for more information.</td> </tr><tr> <td>non-youngs/s</td> <td>The per second average of accesses to old pages in the buffer pool LRU list that have resulted in not making pages young. See the notes that follow this table for more information.</td> </tr><tr> <td>Pages read</td> <td>The total number of pages read from the buffer pool.</td> </tr><tr> <td>Pages created</td> <td>The total number of pages created within the buffer pool.</td> </tr><tr> <td>Pages written</td> <td>The total number of pages written from the buffer pool.</td> </tr><tr> <td>reads/s</td> <td>The per second average number of buffer pool page reads per second.</td> </tr><tr> <td>creates/s</td> <td>The average number of buffer pool pages created per second.</td> </tr><tr> <td>writes/s</td> <td>The average number of buffer pool page writes per second.</td> </tr><tr> <td>Buffer pool hit rate</td> <td>The buffer pool page hit rate for pages read from the buffer pool vs from disk storage.</td> </tr><tr> <td>young-making rate</td> <td>The average hit rate at which page accesses have resulted in making pages young. See the notes that follow this table for more information.</td> </tr><tr> <td>not (young-making rate)</td> <td>The average hit rate at which page accesses have not resulted in making pages young. See the notes that follow this table for more information.</td> </tr><tr> <td>Pages read ahead</td> <td>The per second average of read ahead operations.</td> </tr><tr> <td>Pages evicted without access</td> <td>The per second average of the pages evicted without being accessed from the buffer pool.</td> </tr><tr> <td>Random read ahead</td> <td>The per second average of random read ahead operations.</td> </tr><tr> <td>LRU len</td> <td>The total size in pages of the buffer pool LRU list.</td> </tr><tr> <td>unzip_LRU len</td> <td>The length (in pages) of the buffer pool unzip_LRU list.</td> </tr><tr> <td>I/O sum</td> <td>The total number of buffer pool LRU list pages accessed.</td> </tr><tr> <td>I/O cur</td> <td>The total number of buffer pool LRU list pages accessed in the current interval.</td> </tr><tr> <td>I/O unzip sum</td> <td>The total number of buffer pool unzip_LRU list pages decompressed.</td> </tr><tr> <td>I/O unzip cur</td> <td>The total number of buffer pool unzip_LRU list pages decompressed in the current interval.</td> </tr></tbody></table>

**Notes**:

* The `youngs/s` metric is applicable only to old pages. It is based on the number of page accesses. There can be multiple accesses for a given page, all of which are counted. If you see very low `youngs/s` values when there are no large scans occurring, consider reducing the delay time or increasing the percentage of the buffer pool used for the old sublist. Increasing the percentage makes the old sublist larger so that it takes longer for pages in that sublist to move to the tail, which increases the likelihood that those pages are accessed again and made young. See Section 17.8.3.3, “Making the Buffer Pool Scan Resistant”.

* The `non-youngs/s` metric is applicable only to old pages. It is based on the number of page accesses. There can be multiple accesses for a given page, all of which are counted. If you do not see a higher `non-youngs/s` value when performing large table scans (and a higher `youngs/s` value), increase the delay value. See Section 17.8.3.3, “Making the Buffer Pool Scan Resistant”.

* The `young-making` rate accounts for all buffer pool page accesses, not just accesses for pages in the old sublist. The `young-making` rate and `not` rate do not normally add up to the overall buffer pool hit rate. Page hits in the old sublist cause pages to move to the new sublist, but page hits in the new sublist cause pages to move to the head of the list only if they are a certain distance from the head.

* `not (young-making rate)` is the average hit rate at which page accesses have not resulted in making pages young due to the delay defined by `innodb_old_blocks_time` not being met, or due to page hits in the new sublist that did not result in pages being moved to the head. This rate accounts for all buffer pool page accesses, not just accesses for pages in the old sublist.

Buffer pool [server status variables](server-status-variables.html "7.1.10 Server Status Variables") and the `INNODB_BUFFER_POOL_STATS` table provide many of the same buffer pool metrics found in `InnoDB` Standard Monitor output. For more information, see Example 17.10, “Querying the INNODB_BUFFER_POOL_STATS Table”.


### 17.5.2 Change Buffer

The change buffer is a special data structure that caches changes to secondary index pages when those pages are not in the buffer pool. The buffered changes, which may result from `INSERT`, `UPDATE`, or `DELETE` operations (DML), are merged later when the pages are loaded into the buffer pool by other read operations.

**Figure 17.3 Change Buffer**

![Content is described in the surrounding text.](images/innodb-change-buffer.png)

Unlike [clustered indexes](glossary.html#glos_clustered_index "clustered index"), secondary indexes are usually nonunique, and inserts into secondary indexes happen in a relatively random order. Similarly, deletes and updates may affect secondary index pages that are not adjacently located in an index tree. Merging cached changes at a later time, when affected pages are read into the buffer pool by other operations, avoids substantial random access I/O that would be required to read secondary index pages into the buffer pool from disk.

Periodically, the purge operation that runs when the system is mostly idle, or during a slow shutdown, writes the updated index pages to disk. The purge operation can write disk blocks for a series of index values more efficiently than if each value were written to disk immediately.

Change buffer merging may take several hours when there are many affected rows and numerous secondary indexes to update. During this time, disk I/O is increased, which can cause a significant slowdown for disk-bound queries. Change buffer merging may also continue to occur after a transaction is committed, and even after a server shutdown and restart (see Section 17.21.3, “Forcing InnoDB Recovery” for more information).

In memory, the change buffer occupies part of the buffer pool. On disk, the change buffer is part of the system tablespace, where index changes are buffered when the database server is shut down.

The type of data cached in the change buffer is governed by the `innodb_change_buffering` variable. For more information, see Configuring Change Buffering. You can also configure the maximum change buffer size. For more information, see Configuring the Change Buffer Maximum Size.

Change buffering is not supported for a secondary index if the index contains a descending index column or if the primary key includes a descending index column.

For answers to frequently asked questions about the change buffer, see Section A.16, “MySQL 8.0 FAQ: InnoDB Change Buffer”.

#### Configuring Change Buffering

When `INSERT`, `UPDATE`, and `DELETE` operations are performed on a table, the values of indexed columns (particularly the values of secondary keys) are often in an unsorted order, requiring substantial I/O to bring secondary indexes up to date. The change buffer caches changes to secondary index entries when the relevant page is not in the buffer pool, thus avoiding expensive I/O operations by not immediately reading in the page from disk. The buffered changes are merged when the page is loaded into the buffer pool, and the updated page is later flushed to disk. The `InnoDB` main thread merges buffered changes when the server is nearly idle, and during a slow shutdown.

Because it can result in fewer disk reads and writes, change buffering is most valuable for workloads that are I/O-bound; for example, applications with a high volume of DML operations such as bulk inserts benefit from change buffering.

However, the change buffer occupies a part of the buffer pool, reducing the memory available to cache data pages. If the working set almost fits in the buffer pool, or if your tables have relatively few secondary indexes, it may be useful to disable change buffering. If the working data set fits entirely within the buffer pool, change buffering does not impose extra overhead, because it only applies to pages that are not in the buffer pool.

The `innodb_change_buffering` variable controls the extent to which `InnoDB` performs change buffering. You can enable or disable buffering for inserts, delete operations (when index records are initially marked for deletion) and purge operations (when index records are physically deleted). An update operation is a combination of an insert and a delete. The default `innodb_change_buffering` value is `all`.

Permitted `innodb_change_buffering` values include:

* **`all`**

  The default value: buffer inserts, delete-marking operations, and purges.

* **`none`**

  Do not buffer any operations.

* **`inserts`**

  Buffer insert operations.

* **`deletes`**

  Buffer delete-marking operations.

* **`changes`**

  Buffer both inserts and delete-marking operations.

* **`purges`**

  Buffer the physical deletion operations that happen in the background.

You can set the `innodb_change_buffering` variable in the MySQL option file (`my.cnf` or `my.ini`) or change it dynamically with the `SET GLOBAL` statement, which requires privileges sufficient to set global system variables. See Section 7.1.9.1, “System Variable Privileges”. Changing the setting affects the buffering of new operations; the merging of existing buffered entries is not affected.

#### Configuring the Change Buffer Maximum Size

The `innodb_change_buffer_max_size` variable permits configuring the maximum size of the change buffer as a percentage of the total size of the buffer pool. By default, `innodb_change_buffer_max_size` is set to 25. The maximum setting is 50.

Consider increasing `innodb_change_buffer_max_size` on a MySQL server with heavy insert, update, and delete activity, where change buffer merging does not keep pace with new change buffer entries, causing the change buffer to reach its maximum size limit.

Consider decreasing `innodb_change_buffer_max_size` on a MySQL server with static data used for reporting, or if the change buffer consumes too much of the memory space shared with the buffer pool, causing pages to age out of the buffer pool sooner than desired.

Test different settings with a representative workload to determine an optimal configuration. The `innodb_change_buffer_max_size` variable is dynamic, which permits modifying the setting without restarting the server.

#### Monitoring the Change Buffer

The following options are available for change buffer monitoring:

* `InnoDB` Standard Monitor output includes change buffer status information. To view monitor data, issue the `SHOW ENGINE INNODB STATUS` statement.

  ```
  mysql> SHOW ENGINE INNODB STATUS\G
  ```

  Change buffer status information is located under the `INSERT BUFFER AND ADAPTIVE HASH INDEX` heading and appears similar to the following:

  ```
  -------------------------------------
  INSERT BUFFER AND ADAPTIVE HASH INDEX
  -------------------------------------
  Ibuf: size 1, free list len 0, seg size 2, 0 merges
  merged operations:
   insert 0, delete mark 0, delete 0
  discarded operations:
   insert 0, delete mark 0, delete 0
  Hash table size 4425293, used cells 32, node heap has 1 buffer(s)
  13577.57 hash searches/s, 202.47 non-hash searches/s
  ```

  For more information, see Section 17.17.3, “InnoDB Standard Monitor and Lock Monitor Output”.

* The Information Schema `INNODB_METRICS` table provides most of the data points found in `InnoDB` Standard Monitor output plus other data points. To view change buffer metrics and a description of each, issue the following query:

  ```
  mysql> SELECT NAME, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME LIKE '%ibuf%'\G
  ```

  See Section 17.15.6, “InnoDB INFORMATION_SCHEMA Metrics Table”.

* The Information Schema `INNODB_BUFFER_PAGE` table provides metadata about each page in the buffer pool, including change buffer index and change buffer bitmap pages. Change buffer pages are identified by `PAGE_TYPE`. `IBUF_INDEX` is the page type for change buffer index pages, and `IBUF_BITMAP` is the page type for change buffer bitmap pages.

  Warning

  Querying the `INNODB_BUFFER_PAGE` table can introduce significant performance overhead. To avoid impacting performance, reproduce the issue you want to investigate on a test instance and run your queries on the test instance.

  For example, you can query the `INNODB_BUFFER_PAGE` table to determine the approximate number of `IBUF_INDEX` and `IBUF_BITMAP` pages as a percentage of total buffer pool pages.

  ```
  mysql> SELECT (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
         WHERE PAGE_TYPE LIKE 'IBUF%') AS change_buffer_pages,
         (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE) AS total_pages,
         (SELECT ((change_buffer_pages/total_pages)*100))
         AS change_buffer_page_percentage;
  +---------------------+-------------+-------------------------------+
  | change_buffer_pages | total_pages | change_buffer_page_percentage |
  +---------------------+-------------+-------------------------------+
  |                  25 |        8192 |                        0.3052 |
  +---------------------+-------------+-------------------------------+
  ```

  For information about other data provided by the `INNODB_BUFFER_PAGE` table, see Section 28.4.2, “The INFORMATION_SCHEMA INNODB_BUFFER_PAGE Table”. For related usage information, see Section 17.15.5, “InnoDB INFORMATION_SCHEMA Buffer Pool Tables”.

* Performance Schema provides change buffer mutex wait instrumentation for advanced performance monitoring. To view change buffer instrumentation, issue the following query:

  ```
  mysql> SELECT * FROM performance_schema.setup_instruments
         WHERE NAME LIKE '%wait/synch/mutex/innodb/ibuf%';
  +-------------------------------------------------------+---------+-------+
  | NAME                                                  | ENABLED | TIMED |
  +-------------------------------------------------------+---------+-------+
  | wait/synch/mutex/innodb/ibuf_bitmap_mutex             | YES     | YES   |
  | wait/synch/mutex/innodb/ibuf_mutex                    | YES     | YES   |
  | wait/synch/mutex/innodb/ibuf_pessimistic_insert_mutex | YES     | YES   |
  +-------------------------------------------------------+---------+-------+
  ```

  For information about monitoring `InnoDB` mutex waits, see Section 17.16.2, “Monitoring InnoDB Mutex Waits Using Performance Schema”.


### 17.5.3 Adaptive Hash Index

The adaptive hash index enables `InnoDB` to perform more like an in-memory database on systems with appropriate combinations of workload and sufficient memory for the buffer pool without sacrificing transactional features or reliability. The adaptive hash index is enabled by the `innodb_adaptive_hash_index` variable, or turned off at server startup by `--skip-innodb-adaptive-hash-index`.

Based on the observed pattern of searches, a hash index is built using a prefix of the index key. The prefix can be any length, and it may be that only some values in the B-tree appear in the hash index. Hash indexes are built on demand for the pages of the index that are accessed often.

If a table fits almost entirely in main memory, a hash index speeds up queries by enabling direct lookup of any element, turning the index value into a sort of pointer. `InnoDB` has a mechanism that monitors index searches. If `InnoDB` notices that queries could benefit from building a hash index, it does so automatically.

With some workloads, the speedup from hash index lookups greatly outweighs the extra work to monitor index lookups and maintain the hash index structure. Access to the adaptive hash index can sometimes become a source of contention under heavy workloads, such as multiple concurrent joins. Queries with `LIKE` operators and `%` wildcards also tend not to benefit. For workloads that do not benefit from the adaptive hash index, turning it off reduces unnecessary performance overhead. Because it is difficult to predict in advance whether the adaptive hash index is appropriate for a particular system and workload, consider running benchmarks with it enabled and disabled.

The adaptive hash index feature is partitioned. Each index is bound to a specific partition, and each partition is protected by a separate latch. Partitioning is controlled by the `innodb_adaptive_hash_index_parts` variable. The `innodb_adaptive_hash_index_parts` variable is set to 8 by default. The maximum setting is 512.

You can monitor adaptive hash index use and contention in the `SEMAPHORES` section of [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.15 SHOW ENGINE Statement") output. If there are numerous threads waiting on rw-latches created in `btr0sea.c`, consider increasing the number of adaptive hash index partitions or disabling the adaptive hash index.

For information about the performance characteristics of hash indexes, see Section 10.3.9, “Comparison of B-Tree and Hash Indexes”.


### 17.5.4 Log Buffer

The log buffer is the memory area that holds data to be written to the log files on disk. Log buffer size is defined by the `innodb_log_buffer_size` variable. The default size is 16MB. The contents of the log buffer are periodically flushed to disk. A large log buffer enables large transactions to run without the need to write redo log data to disk before the transactions commit. Thus, if you have transactions that update, insert, or delete many rows, increasing the size of the log buffer saves disk I/O.

The `innodb_flush_log_at_trx_commit` variable controls how the contents of the log buffer are written and flushed to disk. The `innodb_flush_log_at_timeout` variable controls log flushing frequency.

For related information, see Memory Configuration, and Section 10.5.4, “Optimizing InnoDB Redo Logging”.
