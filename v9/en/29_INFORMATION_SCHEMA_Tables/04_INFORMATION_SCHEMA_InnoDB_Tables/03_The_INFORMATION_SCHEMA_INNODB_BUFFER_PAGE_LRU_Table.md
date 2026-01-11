### 28.4.3 The INFORMATION\_SCHEMA INNODB\_BUFFER\_PAGE\_LRU Table

The `INNODB_BUFFER_PAGE_LRU` table provides information about the pages in the `InnoDB` buffer pool; in particular, how they are ordered in the LRU list that determines which pages to evict from the buffer pool when it becomes full.

The `INNODB_BUFFER_PAGE_LRU` table has the same columns as the `INNODB_BUFFER_PAGE` table with a few exceptions. It has `LRU_POSITION` and `COMPRESSED` columns instead of `BLOCK_ID` and `PAGE_STATE` columns, and it does not include and `IS_STALE` column.

For related usage information and examples, see Section 17.15.5, “InnoDB INFORMATION\_SCHEMA Buffer Pool Tables”.

Warning

Querying the `INNODB_BUFFER_PAGE_LRU` table can affect performance. Do not query this table on a production system unless you are aware of the performance impact and have determined it to be acceptable. To avoid impacting performance on a production system, reproduce the issue you want to investigate and query buffer pool statistics on a test instance.

The `INNODB_BUFFER_PAGE_LRU` table has these columns:

* `POOL_ID`

  The buffer pool ID. This is an identifier to distinguish between multiple buffer pool instances.

* `LRU_POSITION`

  The position of the page in the LRU list.

* `SPACE`

  The tablespace ID; the same value as `INNODB_TABLES.SPACE`.

* `PAGE_NUMBER`

  The page number.

* `PAGE_TYPE`

  The page type. The following table shows the permitted values.

  **Table 28.6 INNODB\_BUFFER\_PAGE\_LRU.PAGE\_TYPE Values**

  <table summary="Mapping for interpreting INNODB_BUFFER_PAGE_LRU.PAGE_TYPE values."><thead><tr> <th>Page Type</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>ALLOCATED</code></td> <td>Freshly allocated page</td> </tr><tr> <td><code>BLOB</code></td> <td>Uncompressed BLOB page</td> </tr><tr> <td><code>COMPRESSED_BLOB2</code></td> <td>Subsequent comp BLOB page</td> </tr><tr> <td><code>COMPRESSED_BLOB</code></td> <td>First compressed BLOB page</td> </tr><tr> <td><code>ENCRYPTED_RTREE</code></td> <td>Encrypted R-tree</td> </tr><tr> <td><code>EXTENT_DESCRIPTOR</code></td> <td>Extent descriptor page</td> </tr><tr> <td><code>FILE_SPACE_HEADER</code></td> <td>File space header</td> </tr><tr> <td><code>FIL_PAGE_TYPE_UNUSED</code></td> <td>Unused</td> </tr><tr> <td><code>IBUF_BITMAP</code></td> <td>Insert buffer bitmap</td> </tr><tr> <td><code>IBUF_FREE_LIST</code></td> <td>Insert buffer free list</td> </tr><tr> <td><code>IBUF_INDEX</code></td> <td>Insert buffer index</td> </tr><tr> <td><code>INDEX</code></td> <td>B-tree node</td> </tr><tr> <td><code>INODE</code></td> <td>Index node</td> </tr><tr> <td><code>LOB_DATA</code></td> <td>Uncompressed LOB data</td> </tr><tr> <td><code>LOB_FIRST</code></td> <td>First page of uncompressed LOB</td> </tr><tr> <td><code>LOB_INDEX</code></td> <td>Uncompressed LOB index</td> </tr><tr> <td><code>PAGE_IO_COMPRESSED</code></td> <td>Compressed page</td> </tr><tr> <td><code>PAGE_IO_COMPRESSED_ENCRYPTED</code></td> <td>Compressed and encrypted page</td> </tr><tr> <td><code>PAGE_IO_ENCRYPTED</code></td> <td>Encrypted page</td> </tr><tr> <td><code>RSEG_ARRAY</code></td> <td>Rollback segment array</td> </tr><tr> <td><code>RTREE_INDEX</code></td> <td>R-tree index</td> </tr><tr> <td><code>SDI_BLOB</code></td> <td>Uncompressed SDI BLOB</td> </tr><tr> <td><code>SDI_COMPRESSED_BLOB</code></td> <td>Compressed SDI BLOB</td> </tr><tr> <td><code>SDI_INDEX</code></td> <td>SDI index</td> </tr><tr> <td><code>SYSTEM</code></td> <td>System page</td> </tr><tr> <td><code>TRX_SYSTEM</code></td> <td>Transaction system data</td> </tr><tr> <td><code>UNDO_LOG</code></td> <td>Undo log page</td> </tr><tr> <td><code>UNKNOWN</code></td> <td>Unknown</td> </tr><tr> <td><code>ZLOB_DATA</code></td> <td>Compressed LOB data</td> </tr><tr> <td><code>ZLOB_FIRST</code></td> <td>First page of compressed LOB</td> </tr><tr> <td><code>ZLOB_FRAG</code></td> <td>Compressed LOB fragment</td> </tr><tr> <td><code>ZLOB_FRAG_ENTRY</code></td> <td>Compressed LOB fragment index</td> </tr><tr> <td><code>ZLOB_INDEX</code></td> <td>Compressed LOB index</td> </tr></tbody></table>

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

  The name of the table the page belongs to. This column is applicable only to pages with a `PAGE_TYPE` value of `INDEX`. The column is `NULL` if the server has not yet accessed the table.

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

```
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

* You must have the `PROCESS` privilege to query this table.

* Use the `INFORMATION_SCHEMA` `COLUMNS` table or the `SHOW COLUMNS` statement to view additional information about the columns of this table, including data types and default values.

* Querying this table can require MySQL to allocate a large block of contiguous memory, more than 64 bytes times the number of active pages in the buffer pool. This allocation could potentially cause an out-of-memory error, especially for systems with multi-gigabyte buffer pools.

* Querying this table requires MySQL to lock the data structure representing the buffer pool while traversing the LRU list, which can reduce concurrency, especially for systems with multi-gigabyte buffer pools.

* When tables, table rows, partitions, or indexes are deleted, associated pages remain in the buffer pool until space is required for other data. The `INNODB_BUFFER_PAGE_LRU` table reports information about these pages until they are evicted from the buffer pool. For more information about how the `InnoDB` manages buffer pool data, see Section 17.5.1, “Buffer Pool”.
