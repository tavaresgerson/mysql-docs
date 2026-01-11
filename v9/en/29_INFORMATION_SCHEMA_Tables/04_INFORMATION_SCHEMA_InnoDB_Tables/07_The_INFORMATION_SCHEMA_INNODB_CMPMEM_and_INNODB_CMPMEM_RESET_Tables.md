### 28.4.7 The INFORMATION\_SCHEMA INNODB\_CMPMEM and INNODB\_CMPMEM\_RESET Tables

The `INNODB_CMPMEM` and `INNODB_CMPMEM_RESET` tables provide status information on compressed pages within the `InnoDB` buffer pool.

The `INNODB_CMPMEM` and `INNODB_CMPMEM_RESET` tables have these columns:

* `PAGE_SIZE`

  The block size in bytes. Each record of this table describes blocks of this size.

* `BUFFER_POOL_INSTANCE`

  A unique identifier for the buffer pool instance.

* `PAGES_USED`

  The number of blocks of size `PAGE_SIZE` that are currently in use.

* `PAGES_FREE`

  The number of blocks of size `PAGE_SIZE` that are currently available for allocation. This column shows the external fragmentation in the memory pool. Ideally, these numbers should be at most 1.

* `RELOCATION_OPS`

  The number of times a block of size `PAGE_SIZE` has been relocated. The buddy system can relocate the allocated “buddy neighbor” of a freed block when it tries to form a bigger freed block. Reading from the `INNODB_CMPMEM_RESET` table resets this count.

* `RELOCATION_TIME`

  The total time in microseconds used for relocating blocks of size `PAGE_SIZE`. Reading from the table `INNODB_CMPMEM_RESET` resets this count.

#### Example

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_CMPMEM\G
*************************** 1. row ***************************
           page_size: 1024
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
*************************** 2. row ***************************
           page_size: 2048
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
*************************** 3. row ***************************
           page_size: 4096
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
*************************** 4. row ***************************
           page_size: 8192
buffer_pool_instance: 0
          pages_used: 7673
          pages_free: 15
      relocation_ops: 4638
     relocation_time: 0
*************************** 5. row ***************************
           page_size: 16384
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
```

#### Notes

* Use these tables to measure the effectiveness of `InnoDB` table compression in your database.

* You must have the `PROCESS` privilege to query this table.

* Use the `INFORMATION_SCHEMA` `COLUMNS` table or the `SHOW COLUMNS` statement to view additional information about the columns of this table, including data types and default values.

* For usage information, see Section 17.9.1.4, “Monitoring InnoDB Table Compression at Runtime” and Section 17.15.1.3, “Using the Compression Information Schema Tables”. For general information about `InnoDB` table compression, see Section 17.9, “InnoDB Table and Page Compression”.
