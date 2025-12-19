--- title: MySQL 8.4 Reference Manual :: 10.5.4 Optimizing InnoDB Redo Logging url: https://dev.mysql.com/doc/refman/8.4/en/optimizing-innodb-logging.html order: 74 ---



### 10.5.4 Optimizing InnoDB Redo Logging

Consider the following guidelines for optimizing redo logging:

* Increase the size of your redo log files. When `InnoDB` has written redo log files full, it must write the modified contents of the buffer pool to disk in a  checkpoint. Small redo log files cause many unnecessary disk writes.

  The redo log file size is determined by `innodb_redo_log_capacity`. `InnoDB` tries to maintain 32 redo log files of the same size, with each file equal to 1/32 \* `innodb_redo_log_capacity`. Therefore, changing the `innodb_redo_log_capacity` setting changes the size of the redo log files.

  For information about modifying your redo log file configuration, see  Section 17.6.5, “Redo Log”.
* Consider increasing the size of the log buffer. A large log buffer enables large transactions to run without a need to write the log to disk before the transactions  commit. Thus, if you have transactions that update, insert, or delete many rows, making the log buffer larger saves disk I/O. Log buffer size is configured using the `innodb_log_buffer_size` configuration option, which can be dynamically configured.
* Configure the `innodb_log_write_ahead_size` configuration option to avoid “read-on-write”. This option defines the write-ahead block size for the redo log. Set `innodb_log_write_ahead_size` to match the operating system or file system cache block size. Read-on-write occurs when redo log blocks are not entirely cached to the operating system or file system due to a mismatch between write-ahead block size for the redo log and operating system or file system cache block size.

  Valid values for `innodb_log_write_ahead_size` are multiples of the `InnoDB` log file block size (2n). The minimum value is the `InnoDB` log file block size (512). Write-ahead does not occur when the minimum value is specified. The maximum value is equal to the `innodb_page_size` value. If you specify a value for `innodb_log_write_ahead_size` that is larger than the `innodb_page_size` value, the `innodb_log_write_ahead_size` setting is truncated to the `innodb_page_size` value.

  Setting the `innodb_log_write_ahead_size` value too low in relation to the operating system or file system cache block size results in read-on-write. Setting the value too high may have a slight impact on `fsync` performance for log file writes due to several blocks being written at once.
* MySQL provides dedicated log writer threads for writing redo log records from the log buffer to the system buffers and flushing the system buffers to the redo log files. You can enable or disable log writer threads using the `innodb_log_writer_threads` variable. Dedicated log writer threads can improve performance on high-concurrency systems, but for low-concurrency systems, disabling dedicated log writer threads provides better performance.
* Optimize the use of spin delay by user threads waiting for flushed redo. Spin delay helps reduce latency. During periods of low concurrency, reducing latency may be less of a priority, and avoiding the use of spin delay during these periods may reduce energy consumption. During periods of high concurrency, you may want to avoid expending processing power on spin delay so that it can be used for other work. The following system variables permit setting high and low watermark values that define boundaries for the use of spin delay.

  +  `innodb_log_wait_for_flush_spin_hwm`: Defines the maximum average log flush time beyond which user threads no longer spin while waiting for flushed redo. The default value is 400 microseconds.
  +  `innodb_log_spin_cpu_abs_lwm`: Defines the minimum amount of CPU usage below which user threads no longer spin while waiting for flushed redo. The value is expressed as a sum of CPU core usage. For example, The default value of 80 is 80% of a single CPU core. On a system with a multi-core processor, a value of 150 represents 100% usage of one CPU core plus 50% usage of a second CPU core.
  +  `innodb_log_spin_cpu_pct_hwm`: Defines the maximum amount of CPU usage above which user threads no longer spin while waiting for flushed redo. The value is expressed as a percentage of the combined total processing power of all CPU cores. The default value is 50%. For example, 100% usage of two CPU cores is 50% of the combined CPU processing power on a server with four CPU cores.

    The `innodb_log_spin_cpu_pct_hwm` configuration option respects processor affinity. For example, if a server has 48 cores but the **mysqld** process is pinned to only four CPU cores, the other 44 CPU cores are ignored.

