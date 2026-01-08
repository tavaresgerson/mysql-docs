### 24.4.3 The INFORMATION\_SCHEMA INNODB\_BUFFER\_PAGE\_LRU Table

The [`INNODB_BUFFER_PAGE_LRU`](information-schema-innodb-buffer-page-lru-table.html "24.4.3 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU Table") table provides information about the pages in the `InnoDB` [buffer pool](glossary.html#glos_buffer_pool "buffer pool"); in particular, how they are ordered in the LRU list that determines which pages to [evict](glossary.html#glos_eviction "eviction") from the buffer pool when it becomes full.

The [`INNODB_BUFFER_PAGE_LRU`](information-schema-innodb-buffer-page-lru-table.html "24.4.3 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU Table") table has the same columns as the [`INNODB_BUFFER_PAGE`](information-schema-innodb-buffer-page-table.html "24.4.2 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE Table") table, except that the [`INNODB_BUFFER_PAGE_LRU`](information-schema-innodb-buffer-page-lru-table.html "24.4.3 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU Table") table has `LRU_POSITION` and `COMPRESSED` columns instead of `BLOCK_ID` and `PAGE_STATE` columns.

For related usage information and examples, see [Section 14.16.5, “InnoDB INFORMATION\_SCHEMA Buffer Pool Tables”](innodb-information-schema-buffer-pool-tables.html "14.16.5 InnoDB INFORMATION_SCHEMA Buffer Pool Tables").

Warning

Querying the [`INNODB_BUFFER_PAGE_LRU`](information-schema-innodb-buffer-page-lru-table.html "24.4.3 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU Table") table can affect performance. Do not query this table on a production system unless you are aware of the performance impact and have determined it to be acceptable. To avoid impacting performance on a production system, reproduce the issue you want to investigate and query buffer pool statistics on a test instance.

The [`INNODB_BUFFER_PAGE_LRU`](information-schema-innodb-buffer-page-lru-table.html "24.4.3 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU Table") table has these columns:

* `POOL_ID`

  The buffer pool ID. This is an identifier to distinguish between multiple buffer pool instances.

* `LRU_POSITION`

  The position of the page in the LRU list.

* `SPACE`

  The tablespace ID; the same value as `INNODB_SYS_TABLES.SPACE`.

* `PAGE_NUMBER`

  The page number.

* `PAGE_TYPE`

  The page type. The following table shows the permitted values.

  **Table 24.6 INNODB\_BUFFER\_PAGE\_LRU.PAGE\_TYPE Values**

  <table summary="Mapping for interpreting INNODB_BUFFER_PAGE_LRU.PAGE_TYPE values."><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Page Type</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>ALLOCATED</code></td> <td>Freshly allocated page</td> </tr><tr> <td><code>BLOB</code></td> <td>Uncompressed BLOB page</td> </tr><tr> <td><code>COMPRESSED_BLOB2</code></td> <td>Subsequent comp BLOB page</td> </tr><tr> <td><code>COMPRESSED_BLOB</code></td> <td>First compressed BLOB page</td> </tr><tr> <td><code>EXTENT_DESCRIPTOR</code></td> <td>Extent descriptor page</td> </tr><tr> <td><code>FILE_SPACE_HEADER</code></td> <td>File space header</td> </tr><tr> <td><code>IBUF_BITMAP</code></td> <td>Insert buffer bitmap</td> </tr><tr> <td><code>IBUF_FREE_LIST</code></td> <td>Insert buffer free list</td> </tr><tr> <td><code>IBUF_INDEX</code></td> <td>Insert buffer index</td> </tr><tr> <td><code>INDEX</code></td> <td>B-tree node</td> </tr><tr> <td><code>INODE</code></td> <td>Index node</td> </tr><tr> <td><code>RTREE_INDEX</code></td> <td>R-tree index</td> </tr><tr> <td><code>SYSTEM</code></td> <td>System page</td> </tr><tr> <td><code>TRX_SYSTEM</code></td> <td>Transaction system data</td> </tr><tr> <td><code>UNDO_LOG</code></td> <td>Undo log page</td> </tr><tr> <td><code>UNKNOWN</code></td> <td>Unknown</td> </tr></tbody></table>

* `FLUSH_TYPE`

  The flush type.

* `FIX_COUNT`

  The number of threads using this block within the buffer pool. When zero, the block is eligible to be evicted.

* `IS_HASHED`

  Whether a hash index has been built on this page.

* `NEWEST_MODIFICATION`

  The Log Sequence Number of the youngest modification.

* `OLDEST_MODIFICATION`

  The Log Sequence Number of the oldest modification.

* `ACCESS_TIME`

  An abstract number used to judge the first access time of the page.

* `TABLE_NAME`

  The name of the table the page belongs to. This column is applicable only to pages with a `PAGE_TYPE` value of `INDEX`.

* `INDEX_NAME`

  The name of the index the page belongs to. This can be the name of a clustered index or a secondary index. This column is applicable only to pages with a `PAGE_TYPE` value of `INDEX`.

* `NUMBER_RECORDS`

  The number of records within the page.

* `DATA_SIZE`

  The sum of the sizes of the records. This column is applicable only to pages with a `PAGE_TYPE` value of `INDEX`.

* `COMPRESSED_SIZE`

  The compressed page size. `NULL` for pages that are not compressed.

* `COMPRESSED`

  Whether the page is compressed.

* `IO_FIX`

  Whether any I/O is pending for this page: `IO_NONE` = no pending I/O, `IO_READ` = read pending, `IO_WRITE` = write pending.

* `IS_OLD`

  Whether the block is in the sublist of old blocks in the LRU list.

* `FREE_PAGE_CLOCK`

  The value of the `freed_page_clock` counter when the block was the last placed at the head of the LRU list. The `freed_page_clock` counter tracks the number of blocks removed from the end of the LRU list.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE_LRU LIMIT 1\G
*************************** 1. row ***************************
            POOL_ID: 0
       LRU_POSITION: 0
              SPACE: 97
        PAGE_NUMBER: 1984
          PAGE_TYPE: INDEX
         FLUSH_TYPE: 1
          FIX_COUNT: 0
          IS_HASHED: YES
NEWEST_MODIFICATION: 719490396
OLDEST_MODIFICATION: 0
        ACCESS_TIME: 3378383796
         TABLE_NAME: `employees`.`salaries`
         INDEX_NAME: PRIMARY
     NUMBER_RECORDS: 468
          DATA_SIZE: 14976
    COMPRESSED_SIZE: 0
         COMPRESSED: NO
             IO_FIX: IO_NONE
             IS_OLD: YES
    FREE_PAGE_CLOCK: 0
```

#### Notes

* This table is useful primarily for expert-level performance monitoring, or when developing performance-related extensions for MySQL.

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.

* Querying this table can require MySQL to allocate a large block of contiguous memory, more than 64 bytes times the number of active pages in the buffer pool. This allocation could potentially cause an out-of-memory error, especially for systems with multi-gigabyte buffer pools.

* Querying this table requires MySQL to lock the data structure representing the buffer pool while traversing the LRU list, which can reduce concurrency, especially for systems with multi-gigabyte buffer pools.

* When tables, table rows, partitions, or indexes are deleted, associated pages remain in the buffer pool until space is required for other data. The [`INNODB_BUFFER_PAGE_LRU`](information-schema-innodb-buffer-page-lru-table.html "24.4.3 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU Table") table reports information about these pages until they are evicted from the buffer pool. For more information about how the `InnoDB` manages buffer pool data, see [Section 14.5.1, “Buffer Pool”](innodb-buffer-pool.html "14.5.1 Buffer Pool").
