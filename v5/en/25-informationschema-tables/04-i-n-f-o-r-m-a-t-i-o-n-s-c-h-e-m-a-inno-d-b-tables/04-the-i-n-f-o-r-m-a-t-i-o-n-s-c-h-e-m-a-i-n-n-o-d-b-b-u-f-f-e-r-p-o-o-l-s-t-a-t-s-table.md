### 24.4.4 The INFORMATION\_SCHEMA INNODB\_BUFFER\_POOL\_STATS Table

The [`INNODB_BUFFER_POOL_STATS`](information-schema-innodb-buffer-pool-stats-table.html "24.4.4 The INFORMATION_SCHEMA INNODB_BUFFER_POOL_STATS Table") table provides much of the same buffer pool information provided in [`SHOW ENGINE INNODB STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") output. Much of the same information may also be obtained using `InnoDB` buffer pool [server status variables](server-status-variables.html "5.1.9 Server Status Variables").

The idea of making pages in the buffer pool “young” or “not young” refers to transferring them between the [sublists](glossary.html#glos_sublist "sublist") at the head and tail of the buffer pool data structure. Pages made “young” take longer to age out of the buffer pool, while pages made “not young” are moved much closer to the point of [eviction](glossary.html#glos_eviction "eviction").

For related usage information and examples, see [Section 14.16.5, “InnoDB INFORMATION\_SCHEMA Buffer Pool Tables”](innodb-information-schema-buffer-pool-tables.html "14.16.5 InnoDB INFORMATION_SCHEMA Buffer Pool Tables").

The [`INNODB_BUFFER_POOL_STATS`](information-schema-innodb-buffer-pool-stats-table.html "24.4.4 The INFORMATION_SCHEMA INNODB_BUFFER_POOL_STATS Table") table has these columns:

* `POOL_ID`

  The buffer pool ID. This is an identifier to distinguish between multiple buffer pool instances.

* `POOL_SIZE`

  The `InnoDB` buffer pool size in pages.

* `FREE_BUFFERS`

  The number of free pages in the `InnoDB` buffer pool.

* `DATABASE_PAGES`

  The number of pages in the `InnoDB` buffer pool containing data. This number includes both dirty and clean pages.

* `OLD_DATABASE_PAGES`

  The number of pages in the `old` buffer pool sublist.

* `MODIFIED_DATABASE_PAGES`

  The number of modified (dirty) database pages.

* `PENDING_DECOMPRESS`

  The number of pages pending decompression.

* `PENDING_READS`

  The number of pending reads.

* `PENDING_FLUSH_LRU`

  The number of pages pending flush in the LRU.

* `PENDING_FLUSH_LIST`

  The number of pages pending flush in the flush list.

* `PAGES_MADE_YOUNG`

  The number of pages made young.

* `PAGES_NOT_MADE_YOUNG`

  The number of pages not made young.

* `PAGES_MADE_YOUNG_RATE`

  The number of pages made young per second (pages made young since the last printout / time elapsed).

* `PAGES_MADE_NOT_YOUNG_RATE`

  The number of pages not made per second (pages not made young since the last printout / time elapsed).

* `NUMBER_PAGES_READ`

  The number of pages read.

* `NUMBER_PAGES_CREATED`

  The number of pages created.

* `NUMBER_PAGES_WRITTEN`

  The number of pages written.

* `PAGES_READ_RATE`

  The number of pages read per second (pages read since the last printout / time elapsed).

* `PAGES_CREATE_RATE`

  The number of pages created per second (pages created since the last printout / time elapsed).

* `PAGES_WRITTEN_RATE`

  The number of pages written per second (pages written since the last printout / time elapsed).

* `NUMBER_PAGES_GET`

  The number of logical read requests.

* `HIT_RATE`

  The buffer pool hit rate.

* `YOUNG_MAKE_PER_THOUSAND_GETS`

  The number of pages made young per thousand gets.

* `NOT_YOUNG_MAKE_PER_THOUSAND_GETS`

  The number of pages not made young per thousand gets.

* `NUMBER_PAGES_READ_AHEAD`

  The number of pages read ahead.

* `NUMBER_READ_AHEAD_EVICTED`

  The number of pages read into the `InnoDB` buffer pool by the read-ahead background thread that were subsequently evicted without having been accessed by queries.

* `READ_AHEAD_RATE`

  The read-ahead rate per second (pages read ahead since the last printout / time elapsed).

* `READ_AHEAD_EVICTED_RATE`

  The number of read-ahead pages evicted without access per second (read-ahead pages not accessed since the last printout / time elapsed).

* `LRU_IO_TOTAL`

  Total LRU I/O.

* `LRU_IO_CURRENT`

  LRU I/O for the current interval.

* `UNCOMPRESS_TOTAL`

  The total number of pages decompressed.

* `UNCOMPRESS_CURRENT`

  The number of pages decompressed in the current interval.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_BUFFER_POOL_STATS\G
*************************** 1. row ***************************
                         POOL_ID: 0
                       POOL_SIZE: 8192
                    FREE_BUFFERS: 1
                  DATABASE_PAGES: 8085
              OLD_DATABASE_PAGES: 2964
         MODIFIED_DATABASE_PAGES: 0
              PENDING_DECOMPRESS: 0
                   PENDING_READS: 0
               PENDING_FLUSH_LRU: 0
              PENDING_FLUSH_LIST: 0
                PAGES_MADE_YOUNG: 22821
            PAGES_NOT_MADE_YOUNG: 3544303
           PAGES_MADE_YOUNG_RATE: 357.62602199870594
       PAGES_MADE_NOT_YOUNG_RATE: 0
               NUMBER_PAGES_READ: 2389
            NUMBER_PAGES_CREATED: 12385
            NUMBER_PAGES_WRITTEN: 13111
                 PAGES_READ_RATE: 0
               PAGES_CREATE_RATE: 0
              PAGES_WRITTEN_RATE: 0
                NUMBER_PAGES_GET: 33322210
                        HIT_RATE: 1000
    YOUNG_MAKE_PER_THOUSAND_GETS: 18
NOT_YOUNG_MAKE_PER_THOUSAND_GETS: 0
         NUMBER_PAGES_READ_AHEAD: 2024
       NUMBER_READ_AHEAD_EVICTED: 0
                 READ_AHEAD_RATE: 0
         READ_AHEAD_EVICTED_RATE: 0
                    LRU_IO_TOTAL: 0
                  LRU_IO_CURRENT: 0
                UNCOMPRESS_TOTAL: 0
              UNCOMPRESS_CURRENT: 0
```

#### Notes

* This table is useful primarily for expert-level performance monitoring, or when developing performance-related extensions for MySQL.

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.
