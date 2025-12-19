--- title: MySQL 8.4 Reference Manual :: 10.4.4 Internal Temporary Table Use in MySQL url: https://dev.mysql.com/doc/refman/8.4/en/internal-temporary-tables.html order: 66 ---



### 10.4.4 Internal Temporary Table Use in MySQL

In some cases, the server creates internal temporary tables while processing statements. Users have no direct control over when this occurs.

The server creates temporary tables under conditions such as these:

* Evaluation of  `UNION` statements, with some exceptions described later.
* Evaluation of some views, such those that use the `TEMPTABLE` algorithm, `UNION`, or aggregation.
* Evaluation of derived tables (see Section 15.2.15.8, “Derived Tables”).
* Evaluation of common table expressions (see Section 15.2.20, “WITH (Common Table Expressions)”")).
* Tables created for subquery or semijoin materialization (see [Section 10.2.2, “Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions”](subquery-optimization.html "10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions")).
* Evaluation of statements that contain an `ORDER BY` clause and a different `GROUP BY` clause, or for which the `ORDER BY` or `GROUP BY` contains columns from tables other than the first table in the join queue.
* Evaluation of `DISTINCT` combined with `ORDER BY` may require a temporary table.
* For queries that use the `SQL_SMALL_RESULT` modifier, MySQL uses an in-memory temporary table, unless the query also contains elements (described later) that require on-disk storage.
* To evaluate [`INSERT ... SELECT`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement") statements that select from and insert into the same table, MySQL creates an internal temporary table to hold the rows from the `SELECT`, then inserts those rows into the target table. See Section 15.2.7.1, “INSERT ... SELECT Statement”.
* Evaluation of multiple-table `UPDATE` statements.
* Evaluation of  `GROUP_CONCAT()` or  `COUNT(DISTINCT)` expressions.
* Evaluation of window functions (see Section 14.20, “Window Functions”) uses temporary tables as necessary.

To determine whether a statement requires a temporary table, use `EXPLAIN` and check the `Extra` column to see whether it says `Using temporary` (see Section 10.8.1, “Optimizing Queries with EXPLAIN”). `EXPLAIN` does not necessarily say `Using temporary` for derived or materialized temporary tables. For statements that use window functions,  `EXPLAIN` with `FORMAT=JSON` always provides information about the windowing steps. If the windowing functions use temporary tables, it is indicated for each step.

Some query conditions prevent the use of an in-memory temporary table, in which case the server uses an on-disk table instead:

* Presence of a  `BLOB` or `TEXT` column in the table. The `TempTable` storage engine, which is the default storage engine for in-memory internal temporary tables in MySQL 8.4, supports binary large object types. See Internal Temporary Table Storage Engine.
* Presence of any string column with a maximum length larger than 512 (bytes for binary strings, characters for nonbinary strings) in the  `SELECT` list, if  `UNION` or `UNION ALL` is used.
* The  `SHOW COLUMNS` and `DESCRIBE` statements use `BLOB` as the type for some columns, thus the temporary table used for the results is an on-disk table.

The server does not use a temporary table for `UNION` statements that meet certain qualifications. Instead, it retains from temporary table creation only the data structures necessary to perform result column typecasting. The table is not fully instantiated and no rows are written to or read from it; rows are sent directly to the client. The result is reduced memory and disk requirements, and smaller delay before the first row is sent to the client because the server need not wait until the last query block is executed.  `EXPLAIN` and optimizer trace output reflects this execution strategy: The `UNION RESULT` query block is not present because that block corresponds to the part that reads from the temporary table.

These conditions qualify a `UNION` for evaluation without a temporary table:

* The union is `UNION ALL`, not `UNION` or `UNION DISTINCT`.
* There is no global `ORDER BY` clause.
* The union is not the top-level query block of an `{INSERT | REPLACE} ... SELECT ...` statement.

#### Internal Temporary Table Storage Engine

An internal temporary table can be held in memory and processed by the `TempTable` or `MEMORY` storage engine, or stored on disk by the `InnoDB` storage engine.

##### Storage Engine for In-Memory Internal Temporary Tables

The `internal_tmp_mem_storage_engine` variable defines the storage engine used for in-memory internal temporary tables. Permitted values are `TempTable` (the default) and `MEMORY`.

::: info Note

Configuring a session setting for `internal_tmp_mem_storage_engine` requires the `SESSION_VARIABLES_ADMIN` or `SYSTEM_VARIABLES_ADMIN` privilege.


:::

The `TempTable` storage engine provides efficient storage for  `VARCHAR` and  `VARBINARY` columns, and other binary large object types.

The following variables control `TempTable` storage engine limits and behavior:

*  `tmp_table_size`: Defines the maximum size of any individual in-memory internal temporary table created using the `TempTable` storage engine. When the limit determined by `tmp_table_size` is reached, MySQL automatically converts the in-memory internal temporary table to an `InnoDB` on-disk internal temporary table. The default value is 16777216 bytes (16 MiB).

  The  `tmp_table_size` limit is intended to prevent individual queries from consuming an inordinate amount of global `TempTable` resources, which can affect the performance of concurrent queries that require such resources. Global `TempTable` resources are controlled by `temptable_max_ram` and `temptable_max_mmap`.

  If  `tmp_table_size` is less than  `temptable_max_ram`, it is not possible for an in-memory temporary table to use more than  `tmp_table_size`. If  `tmp_table_size` is greater than the sum of `temptable_max_ram` and `temptable_max_mmap`, an in-memory temporary table cannot use more than the sum of the  `temptable_max_ram` and `temptable_max_mmap` limits.
*  `temptable_max_ram`: Defines the maximum amount of RAM that can be used by the `TempTable` storage engine before it starts allocating space from memory-mapped files or before MySQL starts using `InnoDB` on-disk internal temporary tables, depending on your configuration. If not set explicitly, the value of `temptable_max_ram` is 3% of the total memory available on the server, with a minimum of 1 GB and a maximum of 4 GB.

  ::: info Note

   `temptable_max_ram` does not account for the thread-local memory block allocated to each thread that uses the `TempTable` storage engine. The size of the thread-local memory block depends on the size of the thread's first memory allocation request. If the request is less than 1MB, which it is in most cases, the thread-local memory block size is 1MB. If the request is greater than 1MB, the thread-local memory block is approximately the same size as the initial memory request. The thread-local memory block is held in thread-local storage until thread exit.


  :::
*  `temptable_use_mmap`: Controls whether the `TempTable` storage engine allocates space from memory-mapped files or MySQL uses `InnoDB` on-disk internal temporary tables when the limit determined by `temptable_max_ram` is exceeded. The default value is `OFF`.

  ::: info Note

   `temptable_use_mmap` is deprecated; expect support for it to be removed in a future version of MySQL. Setting `temptable_max_mmap=0` is equivalent to setting `temptable_use_mmap=OFF`.


  :::
*  `temptable_max_mmap`: Sets the maximum amount of memory the `TempTable` storage engine is permitted to allocate from memory-mapped files before MySQL starts using `InnoDB` on-disk internal temporary tables. The default value is `0` (disabled). The limit is intended to address the risk of memory mapped files using too much space in the temporary directory ( `tmpdir`). `temptable_max_mmap = 0` disables allocation from memory-mapped files, effectively disabling their use, regardless of the value of `temptable_use_mmap`.

Use of memory-mapped files by the `TempTable` storage engine is governed by these rules:

* Temporary files are created in the directory defined by the  `tmpdir` variable.
* Temporary files are deleted immediately after they are created and opened, and therefore do not remain visible in the  `tmpdir` directory. The space occupied by temporary files is held by the operating system while temporary files are open. The space is reclaimed when temporary files are closed by the `TempTable` storage engine, or when the `mysqld` process is shut down.
* Data is never moved between RAM and temporary files, within RAM, or between temporary files.
* New data is stored in RAM if space becomes available within the limit defined by `temptable_max_ram`. Otherwise, new data is stored in temporary files.
* If space becomes available in RAM after some of the data for a table is written to temporary files, it is possible for the remaining table data to be stored in RAM.

When using the `MEMORY` storage engine for in-memory temporary tables ( `internal_tmp_mem_storage_engine=MEMORY`), MySQL automatically converts an in-memory temporary table to an on-disk table if it becomes too large. The maximum size of an in-memory temporary table is defined by the `tmp_table_size` or `max_heap_table_size` value, whichever is smaller. This differs from `MEMORY` tables explicitly created with `CREATE TABLE`. For such tables, only the  `max_heap_table_size` variable determines how large a table can grow, and there is no conversion to on-disk format.

##### Storage Engine for On-Disk Internal Temporary Tables

MySQL 8.4 uses only the `InnoDB` storage engine for on-disk internal temporary tables. (The `MYISAM` storage engine is no longer supported for this purpose.)

`InnoDB` on-disk internal temporary tables are created in session temporary tablespaces that reside in the data directory by default. For more information, see Section 17.6.3.5, “Temporary Tablespaces”.

#### Internal Temporary Table Storage Format

When in-memory internal temporary tables are managed by the `TempTable` storage engine, rows that include `VARCHAR` columns, `VARBINARY` columns, and other binary large object type columns are represented in memory by an array of cells, with each cell containing a `NULL` flag, the data length, and a data pointer. Column values are placed in consecutive order after the array, in a single region of memory, without padding. Each cell in the array uses 16 bytes of storage. The same storage format applies when the `TempTable` storage engine allocates space from memory-mapped files.

When in-memory internal temporary tables are managed by the `MEMORY` storage engine, fixed-length row format is used. `VARCHAR` and `VARBINARY` column values are padded to the maximum column length, in effect storing them as `CHAR` and `BINARY` columns.

Internal temporary tables on disk are always managed by `InnoDB`.

When using the `MEMORY` storage engine, statements can initially create an in-memory internal temporary table and then convert it to an on-disk table if the table becomes too large. In such cases, better performance might be achieved by skipping the conversion and creating the internal temporary table on disk to begin with. The `big_tables` variable can be used to force disk storage of internal temporary tables.

#### Monitoring Internal Temporary Table Creation

When an internal temporary table is created in memory or on disk, the server increments the `Created_tmp_tables` value. When an internal temporary table is created on disk, the server increments the `Created_tmp_disk_tables` value. If too many internal temporary tables are created on disk, consider adjusting the engine-specific limits described in  Internal Temporary Table Storage Engine.

::: info Note

Due to a known limitation, `Created_tmp_disk_tables` does not count on-disk temporary tables created in memory-mapped files. By default, the TempTable storage engine overflow mechanism creates internal temporary tables in memory-mapped files. See Internal Temporary Table Storage Engine.


:::

The `memory/temptable/physical_ram` and `memory/temptable/physical_disk` Performance Schema instruments can be used to monitor `TempTable` space allocation from memory and disk. `memory/temptable/physical_ram` reports the amount of allocated RAM. `memory/temptable/physical_disk` reports the amount of space allocated from disk when memory-mapped files are used as the TempTable overflow mechanism. If the `physical_disk` instrument reports a value other than 0 and memory-mapped files are used as the TempTable overflow mechanism, a TempTable memory limit was reached at some point. Data can be queried in Performance Schema memory summary tables such as `memory_summary_global_by_event_name`. See Section 29.12.20.10, “Memory Summary Tables”.


