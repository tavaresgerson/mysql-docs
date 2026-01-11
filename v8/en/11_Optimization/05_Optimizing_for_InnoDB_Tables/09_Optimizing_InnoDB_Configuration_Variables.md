### 10.5.9 Optimizing InnoDB Configuration Variables

Different settings work best for servers with light, predictable loads, versus servers that are running near full capacity all the time, or that experience spikes of high activity.

Because the `InnoDB` storage engine performs many of its optimizations automatically, many performance-tuning tasks involve monitoring to ensure that the database is performing well, and changing configuration options when performance drops. See Section 17.16, “InnoDB Integration with MySQL Performance Schema” for information about detailed `InnoDB` performance monitoring.

The main configuration steps you can perform include:

* Controlling the types of data change operations for which `InnoDB` buffers the changed data, to avoid frequent small disk writes. See Configuring Change Buffering. Because the default is to buffer all types of data change operations, only change this setting if you need to reduce the amount of buffering.

* Turning the adaptive hash indexing feature on and off using the `innodb_adaptive_hash_index` option. See Section 17.5.3, “Adaptive Hash Index” for more information. You might change this setting during periods of unusual activity, then restore it to its original setting.

* Setting a limit on the number of concurrent threads that `InnoDB` processes, if context switching is a bottleneck. See Section 17.8.4, “Configuring Thread Concurrency for InnoDB”.

* Controlling the amount of prefetching that `InnoDB` does with its read-ahead operations. When the system has unused I/O capacity, more read-ahead can improve the performance of queries. Too much read-ahead can cause periodic drops in performance on a heavily loaded system. See Section 17.8.3.4, “Configuring InnoDB Buffer Pool Prefetching (Read-Ahead)”").

* Increasing the number of background threads for read or write operations, if you have a high-end I/O subsystem that is not fully utilized by the default values. See Section 17.8.5, “Configuring the Number of Background InnoDB I/O Threads”.

* Controlling how much I/O `InnoDB` performs in the background. See Section 17.8.7, “Configuring InnoDB I/O Capacity”. You might scale back this setting if you observe periodic drops in performance.

* Controlling the algorithm that determines when `InnoDB` performs certain types of background writes. See Section 17.8.3.5, “Configuring Buffer Pool Flushing”. The algorithm works for some types of workloads but not others, so you might disable this feature if you observe periodic drops in performance.

* Taking advantage of multicore processors and their cache memory configuration, to minimize delays in context switching. See Section 17.8.8, “Configuring Spin Lock Polling”.

* Preventing one-time operations such as table scans from interfering with the frequently accessed data stored in the `InnoDB` buffer cache. See Section 17.8.3.3, “Making the Buffer Pool Scan Resistant”.

* Adjusting log files to a size that makes sense for reliability and crash recovery. `InnoDB` log files have often been kept small to avoid long startup times after a crash. Optimizations introduced in MySQL 5.5 speed up certain steps of the crash recovery process. In particular, scanning the redo log and applying the redo log are faster due to improved algorithms for memory management. If you have kept your log files artificially small to avoid long startup times, you can now consider increasing log file size to reduce the I/O that occurs due recycling of redo log records.

* Configuring the size and number of instances for the `InnoDB` buffer pool, especially important for systems with multi-gigabyte buffer pools. See Section 17.8.3.2, “Configuring Multiple Buffer Pool Instances”.

* Increasing the maximum number of concurrent transactions, which dramatically improves scalability for the busiest databases. See Section 17.6.6, “Undo Logs”.

* Moving purge operations (a type of garbage collection) into a background thread. See Section 17.8.9, “Purge Configuration”. To effectively measure the results of this setting, tune the other I/O-related and thread-related configuration settings first.

* Reducing the amount of switching that `InnoDB` does between concurrent threads, so that SQL operations on a busy server do not queue up and form a “traffic jam”. Set a value for the `innodb_thread_concurrency` option, up to approximately 32 for a high-powered modern system. Increase the value for the `innodb_concurrency_tickets` option, typically to 5000 or so. This combination of options sets a cap on the number of threads that `InnoDB` processes at any one time, and allows each thread to do substantial work before being swapped out, so that the number of waiting threads stays low and operations can complete without excessive context switching.
