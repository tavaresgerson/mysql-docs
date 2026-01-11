### 17.12.5 Configuring Parallel Threads for Online DDL Operations

The workflow of an online DDL operation that creates or rebuilds a secondary index involves:

* Scanning the clustered index and writing data to temporary sort files

* Sorting the data
* Loading sorted data from the temporary sort files into the secondary index

The number of parallel threads that can be used to scan clustered index is defined by the `innodb_parallel_read_threads` variable. The default setting is 4. The maximum setting is 256, which is the maximum number for all sessions. The actual number of threads that scan the clustered index is the number defined by the `innodb_parallel_read_threads` setting or the number of index subtrees to scan, whichever is smaller. If the thread limit is reached, sessions fall back to using a single thread.

The number of parallel threads that sort and load data is controlled by the `innodb_ddl_threads` variable, introduced in MySQL 8.0.27. The default setting is 4. Prior to MySQL 8.0.27, sort and load operations are single-threaded.

The following limitations apply:

* Parallel threads are not supported for building indexes that include virtual columns.

* Parallel threads are not supported for full-text index creation.

* Parallel threads are not supported for spatial index creation.
* Parallel scan is not supported on tables defined with virtual columns.

* Parallel scan is not supported on tables defined with a full-text index.

* Parallel scan is not supported on tables defined with a spatial index.
