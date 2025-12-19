--- title: MySQL 8.4 Reference Manual :: 10.5.8 Optimizing InnoDB Disk I/O url: https://dev.mysql.com/doc/refman/8.4/en/optimizing-innodb-diskio.html order: 78 ---



### 10.5.8 Optimizing InnoDB Disk I/O

If you follow best practices for database design and tuning techniques for SQL operations, but your database is still slow due to heavy disk I/O activity, consider these disk I/O optimizations. If the Unix `top` tool or the Windows Task Manager shows that the CPU usage percentage with your workload is less than 70%, your workload is probably disk-bound.

* Increase buffer pool size

  When table data is cached in the `InnoDB` buffer pool, it can be accessed repeatedly by queries without requiring any disk I/O. Specify the size of the buffer pool with the `innodb_buffer_pool_size` option. This memory area is important enough that it is typically recommended that `innodb_buffer_pool_size` is configured to 50 to 75 percent of system memory. For more information see,  Section 10.12.3.1, “How MySQL Uses Memory”.
* Adjust the flush method

  In some versions of GNU/Linux and Unix, flushing files to disk with the Unix `fsync()` call and similar methods is surprisingly slow. If database write performance is an issue, conduct benchmarks with the `innodb_flush_method` parameter set to `O_DSYNC`.
* Configure a threshold for operating system flushes

  By default, when `InnoDB` creates a new data file, such as a new log file or tablespace file, the file is fully written to the operating system cache before it is flushed to disk, which can cause a large amount of disk write activity to occur at once. To force smaller, periodic flushes of data from the operating system cache, you can use the `innodb_fsync_threshold` variable to define a threshold value, in bytes. When the byte threshold is reached, the contents of the operating system cache are flushed to disk. The default value of 0 forces the default behavior, which is to flush data to disk only after a file is fully written to the cache.

  Specifying a threshold to force smaller, periodic flushes may be beneficial in cases where multiple MySQL instances use the same storage devices. For example, creating a new MySQL instance and its associated data files could cause large surges of disk write activity, impeding the performance of other MySQL instances that use the same storage devices. Configuring a threshold helps avoid such surges in write activity.
* Use fdatasync() instead of fsync()

  On platforms that support `fdatasync()` system calls, the `innodb_use_fdatasync` variable permits using `fdatasync()` instead of `fsync()` for operating system flushes. An `fdatasync()` system call does not flush changes to file metadata unless required for subsequent data retrieval, providing a potential performance benefit.

  A subset of `innodb_flush_method` settings such as `fsync`, `O_DSYNC`, and `O_DIRECT` use `fsync()` system calls. The `innodb_use_fdatasync` variable is applicable when using those settings.
* Use a noop or deadline I/O scheduler with native AIO on Linux

  `InnoDB` uses the asynchronous I/O subsystem (native AIO) on Linux to perform read-ahead and write requests for data file pages. This behavior is controlled by the `innodb_use_native_aio` configuration option, which is enabled by default. With native AIO, the type of I/O scheduler has greater influence on I/O performance. Generally, noop and deadline I/O schedulers are recommended. Conduct benchmarks to determine which I/O scheduler provides the best results for your workload and environment. For more information, see Section 17.8.6, “Using Asynchronous I/O on Linux”.
* Use direct I/O on Solaris 10 for x86\_64 architecture

  When using the `InnoDB` storage engine on Solaris 10 for x86\_64 architecture (AMD Opteron), use direct I/O for `InnoDB`-related files to avoid degradation of `InnoDB` performance. To use direct I/O for an entire UFS file system used for storing `InnoDB`-related files, mount it with the `forcedirectio` option; see `mount_ufs(1M)`. (The default on Solaris 10/x86\_64 is *not* to use this option.) To apply direct I/O only to `InnoDB` file operations rather than the whole file system, set [`innodb_flush_method = O_DIRECT`](innodb-parameters.html#sysvar_innodb_flush_method). With this setting, `InnoDB` calls `directio()` instead of `fcntl()` for I/O to data files (not for I/O to log files).
* Use raw storage for data and log files with Solaris 2.6 or later

  When using the `InnoDB` storage engine with a large `innodb_buffer_pool_size` value on any release of Solaris 2.6 and up and any platform (sparc/x86/x64/amd64), conduct benchmarks with `InnoDB` data files and log files on raw devices or on a separate direct I/O UFS file system, using the `forcedirectio` mount option as described previously. (It is necessary to use the mount option rather than setting `innodb_flush_method` if you want direct I/O for the log files.) Users of the Veritas file system VxFS should use the `convosync=direct` mount option.

  Do not place other MySQL data files, such as those for `MyISAM` tables, on a direct I/O file system. Executables or libraries *must not* be placed on a direct I/O file system.
* Use additional storage devices

  Additional storage devices could be used to set up a RAID configuration. For related information, see Section 10.12.1, “Optimizing Disk I/O”.

  Alternatively, `InnoDB` tablespace data files and log files can be placed on different physical disks. For more information, refer to the following sections:

  +  Section 17.8.1, “InnoDB Startup Configuration”
  +  Section 17.6.1.2, “Creating Tables Externally”
  +  Creating a General Tablespace
  +  Section 17.6.1.4, “Moving or Copying InnoDB Tables”
* Consider non-rotational storage

  Non-rotational storage generally provides better performance for random I/O operations; and rotational storage for sequential I/O operations. When distributing data and log files across rotational and non-rotational storage devices, consider the type of I/O operations that are predominantly performed on each file.

  Random I/O-oriented files typically include file-per-table and [general tablespace](glossary.html#glos_general_tablespace "general tablespace") data files, undo tablespace files, and [temporary tablespace](glossary.html#glos_temporary_tablespace "temporary tablespace") files. Sequential I/O-oriented files include `InnoDB` [system tablespace](glossary.html#glos_system_tablespace "system tablespace") files, doublewrite files, and log files such as  binary log files and  redo log files.

  Review settings for the following configuration options when using non-rotational storage:

  +  `innodb_checksum_algorithm`

    The `crc32` option uses a faster checksum algorithm and is recommended for fast storage systems.
  +  `innodb_flush_neighbors`

    Optimizes I/O for rotational storage devices. Disable it for non-rotational storage or a mix of rotational and non-rotational storage. It is disabled by default.
  +  `innodb_idle_flush_pct`

    Permits placing a limit on page flushing during idle periods, which can help extend the life of non-rotational storage devices.
  +  `innodb_io_capacity`

    The default setting of 10000 is generally sufficient.
  +  `innodb_io_capacity_max`

    The default value of (2 \* `innodb_io_capacity`) is intended for most workloads.
  +  `innodb_log_compressed_pages`

    If redo logs are on non-rotational storage, consider disabling this option to reduce logging. See [Disable logging of compressed pages](optimizing-innodb-diskio.html#innodb-disable-log-compressed-pages).
  +  `innodb_log_file_size` (deprecated)

    If redo logs are on non-rotational storage, configure this option to maximize caching and write combining.
  +  `innodb_redo_log_capacity`

    If redo logs are on non-rotational storage, configure this option to maximize caching and write combining.
  +  `innodb_page_size`

    Consider using a page size that matches the internal sector size of the disk. Early-generation SSD devices often have a 4KB sector size. Some newer devices have a 16KB sector size. The default `InnoDB` page size is 16KB. Keeping the page size close to the storage device block size minimizes the amount of unchanged data that is rewritten to disk.
  +  `binlog_row_image`

    If binary logs are on non-rotational storage and all tables have primary keys, consider setting this option to `minimal` to reduce logging.

  Ensure that TRIM support is enabled for your operating system. It is typically enabled by default.
* Increase I/O capacity to avoid backlogs

  If throughput drops periodically because of `InnoDB` checkpoint operations, consider increasing the value of the `innodb_io_capacity` configuration option. Higher values cause more frequent flushing, avoiding the backlog of work that can cause dips in throughput.
* Lower I/O capacity if flushing does not fall behind

  If the system is not falling behind with `InnoDB` flushing operations, consider lowering the value of the `innodb_io_capacity` configuration option. Typically, you keep this option value as low as practical, but not so low that it causes periodic drops in throughput as mentioned in the preceding bullet. In a typical scenario where you could lower the option value, you might see a combination like this in the output from [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.16 SHOW ENGINE Statement"):

  + History list length low, below a few thousand.
  + Insert buffer merges close to rows inserted.
  + Modified pages in buffer pool consistently well below `innodb_max_dirty_pages_pct` of the buffer pool. (Measure at a time when the server is not doing bulk inserts; it is normal during bulk inserts for the modified pages percentage to rise significantly.)
  + `Log sequence number - Last checkpoint` is at less than 7/8 or ideally less than 6/8 of the total size of the `InnoDB` log files.
* Store system tablespace files on Fusion-io devices

  You can take advantage of a doublewrite buffer-related I/O optimization by storing the files that contain the doublewrite storage area on Fusion-io devices that support atomic writes. (The doublewrite buffer storage area resides in doublewrite files. See Section 17.6.4, “Doublewrite Buffer”.) When doublewrite storage area files are placed on Fusion-io devices that support atomic writes, the doublewrite buffer is automatically disabled and Fusion-io atomic writes are used for all data files. This feature is only supported on Fusion-io hardware and is only enabled for Fusion-io NVMFS on Linux. To take full advantage of this feature, an `innodb_flush_method` setting of `O_DIRECT` is recommended.

  ::: info Note

  Because the doublewrite buffer setting is global, the doublewrite buffer is also disabled for data files that do not reside on Fusion-io hardware.


  :::
* Disable logging of compressed pages

  When using the `InnoDB` table compression feature, images of re-compressed pages are written to the redo log when changes are made to compressed data. This behavior is controlled by `innodb_log_compressed_pages`, which is enabled by default to prevent corruption that can occur if a different version of the `zlib` compression algorithm is used during recovery. If you are certain that the `zlib` version is not subject to change, disable `innodb_log_compressed_pages` to reduce redo log generation for workloads that modify compressed data.

