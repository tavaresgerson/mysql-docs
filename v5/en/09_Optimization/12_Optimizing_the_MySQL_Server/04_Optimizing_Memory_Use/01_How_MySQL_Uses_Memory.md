#### 8.12.4.1 How MySQL Uses Memory

MySQL allocates buffers and caches to improve performance of
database operations. The default configuration is designed to
permit a MySQL server to start on a virtual machine that has
approximately 512MB of RAM. You can improve MySQL performance
by increasing the values of certain cache and buffer-related
system variables. You can also modify the default
configuration to run MySQL on systems with limited memory.

The following list describes some of the ways that MySQL uses
memory. Where applicable, relevant system variables are
referenced. Some items are storage engine or feature specific.

* The `InnoDB` buffer pool is a memory area
  that holds cached `InnoDB` data for
  tables, indexes, and other auxiliary buffers. For
  efficiency of high-volume read operations, the buffer pool
  is divided into [pages](glossary.html#glos_page "page")
  that can potentially hold multiple rows. For efficiency of
  cache management, the buffer pool is implemented as a
  linked list of pages; data that is rarely used is aged out
  of the cache, using a variation of the
  [LRU](glossary.html#glos_lru "LRU") algorithm. For more
  information, see [Section 14.5.1, “Buffer Pool”](innodb-buffer-pool.html "14.5.1 Buffer Pool").

  The size of the buffer pool is important for system
  performance:

  + `InnoDB` allocates memory for the
    entire buffer pool at server startup, using
    `malloc()` operations. The
    [`innodb_buffer_pool_size`](innodb-parameters.html#sysvar_innodb_buffer_pool_size)
    system variable defines the buffer pool size.
    Typically, a recommended
    [`innodb_buffer_pool_size`](innodb-parameters.html#sysvar_innodb_buffer_pool_size)
    value is 50 to 75 percent of system memory.
    [`innodb_buffer_pool_size`](innodb-parameters.html#sysvar_innodb_buffer_pool_size)
    can be configured dynamically, while the server is
    running. For more information, see
    [Section 14.8.3.1, “Configuring InnoDB Buffer Pool Size”](innodb-buffer-pool-resize.html "14.8.3.1 Configuring InnoDB Buffer Pool Size").

  + On systems with a large amount of memory, you can
    improve concurrency by dividing the buffer pool into
    multiple
    [buffer pool
    instances](glossary.html#glos_buffer_pool_instance "buffer pool instance"). The
    [`innodb_buffer_pool_instances`](innodb-parameters.html#sysvar_innodb_buffer_pool_instances)
    system variable defines the number of buffer pool
    instances.

  + A buffer pool that is too small may cause excessive
    churning as pages are flushed from the buffer pool
    only to be required again a short time later.

  + A buffer pool that is too large may cause swapping due
    to competition for memory.

* All threads share the [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine")
  key buffer. The
  [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) system
  variable determines its size.

  For each `MyISAM` table the server opens,
  the index file is opened once; the data file is opened
  once for each concurrently running thread that accesses
  the table. For each concurrent thread, a table structure,
  column structures for each column, and a buffer of size
  `3 * N` are
  allocated (where *`N`* is the
  maximum row length, not counting
  [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") columns). A
  [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") column requires five
  to eight bytes plus the length of the
  [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") data. The
  `MyISAM` storage engine maintains one
  extra row buffer for internal use.

* The [`myisam_use_mmap`](server-system-variables.html#sysvar_myisam_use_mmap)
  system variable can be set to 1 to enable memory-mapping
  for all `MyISAM` tables.

* If an internal in-memory temporary table becomes too large
  (as determined using the
  [`tmp_table_size`](server-system-variables.html#sysvar_tmp_table_size) and
  [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size)
  system variables), MySQL automatically converts the table
  from in-memory to on-disk format. On-disk temporary tables
  use the storage engine defined by the
  [`internal_tmp_disk_storage_engine`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine)
  system variable. You can increase the permissible
  temporary table size as described in
  [Section 8.4.4, “Internal Temporary Table Use in MySQL”](internal-temporary-tables.html "8.4.4 Internal Temporary Table Use in MySQL").

  For [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine") tables explicitly
  created with [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"),
  only the
  [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size)
  system variable determines how large a table can grow, and
  there is no conversion to on-disk format.

* The [MySQL Performance
  Schema](performance-schema.html "Chapter 25 MySQL Performance Schema") is a feature for monitoring MySQL server
  execution at a low level. The Performance Schema
  dynamically allocates memory incrementally, scaling its
  memory use to actual server load, instead of allocating
  required memory during server startup. Once memory is
  allocated, it is not freed until the server is restarted.
  For more information, see
  [Section 25.17, “The Performance Schema Memory-Allocation Model”](performance-schema-memory-model.html "25.17 The Performance Schema Memory-Allocation Model").

* Each thread that the server uses to manage client
  connections requires some thread-specific space. The
  following list indicates these and which system variables
  control their size:

  + A stack
    ([`thread_stack`](server-system-variables.html#sysvar_thread_stack))

  + A connection buffer
    ([`net_buffer_length`](server-system-variables.html#sysvar_net_buffer_length))

  + A result buffer
    ([`net_buffer_length`](server-system-variables.html#sysvar_net_buffer_length))

  The connection buffer and result buffer each begin with a
  size equal to
  [`net_buffer_length`](server-system-variables.html#sysvar_net_buffer_length) bytes,
  but are dynamically enlarged up to
  [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) bytes
  as needed. The result buffer shrinks to
  [`net_buffer_length`](server-system-variables.html#sysvar_net_buffer_length) bytes
  after each SQL statement. While a statement is running, a
  copy of the current statement string is also allocated.

  Each connection thread uses memory for computing statement
  digests. The server allocates
  [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes
  per session. See
  [Section 25.10, “Performance Schema Statement Digests”](performance-schema-statement-digests.html "25.10 Performance Schema Statement Digests").

* All threads share the same base memory.
* When a thread is no longer needed, the memory allocated to
  it is released and returned to the system unless the
  thread goes back into the thread cache. In that case, the
  memory remains allocated.

* Each request that performs a sequential scan of a table
  allocates a read
  buffer. The
  [`read_buffer_size`](server-system-variables.html#sysvar_read_buffer_size) system
  variable determines the buffer size.

* When reading rows in an arbitrary sequence (for example,
  following a sort), a
  random-read buffer
  may be allocated to avoid disk seeks. The
  [`read_rnd_buffer_size`](server-system-variables.html#sysvar_read_rnd_buffer_size)
  system variable determines the buffer size.

* All joins are executed in a single pass, and most joins
  can be done without even using a temporary table. Most
  temporary tables are memory-based hash tables. Temporary
  tables with a large row length (calculated as the sum of
  all column lengths) or that contain
  [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") columns are stored on
  disk.

* Most requests that perform a sort allocate a sort buffer
  and zero to two temporary files depending on the result
  set size. See [Section B.3.3.5, “Where MySQL Stores Temporary Files”](temporary-files.html "B.3.3.5 Where MySQL Stores Temporary Files").

* Almost all parsing and calculating is done in thread-local
  and reusable memory pools. No memory overhead is needed
  for small items, thus avoiding the normal slow memory
  allocation and freeing. Memory is allocated only for
  unexpectedly large strings.

* For each table having [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")
  columns, a buffer is enlarged dynamically to read in
  larger [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") values. If you
  scan a table, the buffer grows as large as the largest
  [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") value.

* MySQL requires memory and descriptors for the table cache.
  Handler structures for all in-use tables are saved in the
  table cache and managed as “First In, First
  Out” (FIFO). The
  [`table_open_cache`](server-system-variables.html#sysvar_table_open_cache) system
  variable defines the initial table cache size; see
  [Section 8.4.3.1, “How MySQL Opens and Closes Tables”](table-cache.html "8.4.3.1 How MySQL Opens and Closes Tables").

  MySQL also requires memory for the table definition cache.
  The
  [`table_definition_cache`](server-system-variables.html#sysvar_table_definition_cache)
  system variable defines the number of table definitions
  (from `.frm` files) that can be stored
  in the table definition cache. If you use a large number
  of tables, you can create a large table definition cache
  to speed up the opening of tables. The table definition
  cache takes less space and does not use file descriptors,
  unlike the table cache.

* A [`FLUSH TABLES`](flush.html#flush-tables) statement or
  [**mysqladmin flush-tables**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command closes
  all tables that are not in use at once and marks all
  in-use tables to be closed when the currently executing
  thread finishes. This effectively frees most in-use
  memory. [`FLUSH TABLES`](flush.html#flush-tables) does
  not return until all tables have been closed.

* The server caches information in memory as a result of
  [`GRANT`](grant.html "13.7.1.4 GRANT Statement"),
  [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"),
  [`CREATE SERVER`](create-server.html "13.1.17 CREATE SERVER Statement"), and
  [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") statements.
  This memory is not released by the corresponding
  [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"),
  [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"),
  [`DROP SERVER`](drop-server.html "13.1.28 DROP SERVER Statement"), and
  [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement")
  statements, so for a server that executes many instances
  of the statements that cause caching, cached memory use is
  very likely to increase unless it is freed with
  [`FLUSH PRIVILEGES`](flush.html#flush-privileges).

**ps** and other system status programs may
report that [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") uses a lot of memory.
This may be caused by thread stacks on different memory
addresses. For example, the Solaris version of
**ps** counts the unused memory between stacks
as used memory. To verify this, check available swap with
`swap -s`. We test [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server")
with several memory-leakage detectors (both commercial and
Open Source), so there should be no memory leaks.