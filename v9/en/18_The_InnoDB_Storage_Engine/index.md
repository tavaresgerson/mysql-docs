# Chapter 17 The InnoDB Storage Engine

**Table of Contents**

[17.1 Introduction to InnoDB](innodb-introduction.html)
:   [17.1.1 Benefits of Using InnoDB Tables](innodb-benefits.html)

    [17.1.2 Best Practices for InnoDB Tables](innodb-best-practices.html)

    [17.1.3 Verifying that InnoDB is the Default Storage Engine](innodb-check-availability.html)

    [17.1.4 Testing and Benchmarking with InnoDB](innodb-benchmarking.html)

[17.2 InnoDB and the ACID Model](mysql-acid.html)

[17.3 InnoDB Multi-Versioning](innodb-multi-versioning.html)

[17.4 InnoDB Architecture](innodb-architecture.html)

[17.5 InnoDB In-Memory Structures](innodb-in-memory-structures.html)
:   [17.5.1 Buffer Pool](innodb-buffer-pool.html)

    [17.5.2 Change Buffer](innodb-change-buffer.html)

    [17.5.3 Adaptive Hash Index](innodb-adaptive-hash.html)

    [17.5.4 Log Buffer](innodb-redo-log-buffer.html)

[17.6 InnoDB On-Disk Structures](innodb-on-disk-structures.html)
:   [17.6.1 Tables](innodb-tables.html)

    [17.6.2 Indexes](innodb-indexes.html)

    [17.6.3 Tablespaces](innodb-tablespace.html)

    [17.6.4 Doublewrite Buffer](innodb-doublewrite-buffer.html)

    [17.6.5 Redo Log](innodb-redo-log.html)

    [17.6.6 Undo Logs](innodb-undo-logs.html)

[17.7 InnoDB Locking and Transaction Model](innodb-locking-transaction-model.html)
:   [17.7.1 InnoDB Locking](innodb-locking.html)

    [17.7.2 InnoDB Transaction Model](innodb-transaction-model.html)

    [17.7.3 Locks Set by Different SQL Statements in InnoDB](innodb-locks-set.html)

    [17.7.4 Phantom Rows](innodb-next-key-locking.html)

    [17.7.5 Deadlocks in InnoDB](innodb-deadlocks.html)

    [17.7.6 Transaction Scheduling](innodb-transaction-scheduling.html)

[17.8 InnoDB Configuration](innodb-configuration.html)
:   [17.8.1 InnoDB Startup Configuration](innodb-init-startup-configuration.html)

    [17.8.2 Configuring InnoDB for Read-Only Operation](innodb-read-only-instance.html)

    [17.8.3 InnoDB Buffer Pool Configuration](innodb-performance-buffer-pool.html)

    [17.8.4 Configuring Thread Concurrency for InnoDB](innodb-performance-thread_concurrency.html)

    [17.8.5 Configuring the Number of Background InnoDB I/O Threads](innodb-performance-multiple_io_threads.html)

    [17.8.6 Using Asynchronous I/O on Linux](innodb-linux-native-aio.html)

    [17.8.7 Configuring InnoDB I/O Capacity](innodb-configuring-io-capacity.html)

    [17.8.8 Configuring Spin Lock Polling](innodb-performance-spin_lock_polling.html)

    [17.8.9 Purge Configuration](innodb-purge-configuration.html)

    [17.8.10 Configuring Optimizer Statistics for InnoDB](innodb-performance-optimizer-statistics.html)

    [17.8.11 Configuring the Merge Threshold for Index Pages](index-page-merge-threshold.html)

    [17.8.12 Container Detection and Configuration](innodb-container-detection.html)

    [17.8.13 Enabling Automatic InnoDB Configuration for a Dedicated MySQL Server](innodb-dedicated-server.html)

[17.9 InnoDB Table and Page Compression](innodb-compression.html)
:   [17.9.1 InnoDB Table Compression](innodb-table-compression.html)

    [17.9.2 InnoDB Page Compression](innodb-page-compression.html)

[17.10 InnoDB Row Formats](innodb-row-format.html)

[17.11 InnoDB Disk I/O and File Space Management](innodb-disk-management.html)
:   [17.11.1 InnoDB Disk I/O](innodb-disk-io.html)

    [17.11.2 File Space Management](innodb-file-space.html)

    [17.11.3 InnoDB Checkpoints](innodb-checkpoints.html)

    [17.11.4 Defragmenting a Table](innodb-file-defragmenting.html)

    [17.11.5 Reclaiming Disk Space with TRUNCATE TABLE](innodb-truncate-table-reclaim-space.html)

[17.12 InnoDB and Online DDL](innodb-online-ddl.html)
:   [17.12.1 Online DDL Operations](innodb-online-ddl-operations.html)

    [17.12.2 Online DDL Performance and Concurrency](innodb-online-ddl-performance.html)

    [17.12.3 Online DDL Space Requirements](innodb-online-ddl-space-requirements.html)

    [17.12.4 Online DDL Memory Management](online-ddl-memory-management.html)

    [17.12.5 Configuring Parallel Threads for Online DDL Operations](online-ddl-parallel-thread-configuration.html)

    [17.12.6 Simplifying DDL Statements with Online DDL](innodb-online-ddl-single-multi.html)

    [17.12.7 Online DDL Failure Conditions](innodb-online-ddl-failure-conditions.html)

    [17.12.8 Online DDL Limitations](innodb-online-ddl-limitations.html)

[17.13 InnoDB Data-at-Rest Encryption](innodb-data-encryption.html)

[17.14 InnoDB Startup Options and System Variables](innodb-parameters.html)

[17.15 InnoDB INFORMATION\_SCHEMA Tables](innodb-information-schema.html)
:   [17.15.1 InnoDB INFORMATION\_SCHEMA Tables about Compression](innodb-information-schema-compression-tables.html)

    [17.15.2 InnoDB INFORMATION\_SCHEMA Transaction and Locking Information](innodb-information-schema-transactions.html)

    [17.15.3 InnoDB INFORMATION\_SCHEMA Schema Object Tables](innodb-information-schema-system-tables.html)

    [17.15.4 InnoDB INFORMATION\_SCHEMA FULLTEXT Index Tables](innodb-information-schema-fulltext_index-tables.html)

    [17.15.5 InnoDB INFORMATION\_SCHEMA Buffer Pool Tables](innodb-information-schema-buffer-pool-tables.html)

    [17.15.6 InnoDB INFORMATION\_SCHEMA Metrics Table](innodb-information-schema-metrics-table.html)

    [17.15.7 InnoDB INFORMATION\_SCHEMA Temporary Table Info Table](innodb-information-schema-temp-table-info.html)

    [17.15.8 Retrieving InnoDB Tablespace Metadata from INFORMATION\_SCHEMA.FILES](innodb-information-schema-files-table.html)

[17.16 InnoDB Integration with MySQL Performance Schema](innodb-performance-schema.html)
:   [17.16.1 Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema](monitor-alter-table-performance-schema.html)

    [17.16.2 Monitoring InnoDB Mutex Waits Using Performance Schema](monitor-innodb-mutex-waits-performance-schema.html)

[17.17 InnoDB Monitors](innodb-monitors.html)
:   [17.17.1 InnoDB Monitor Types](innodb-monitor-types.html)

    [17.17.2 Enabling InnoDB Monitors](innodb-enabling-monitors.html)

    [17.17.3 InnoDB Standard Monitor and Lock Monitor Output](innodb-standard-monitor.html)

[17.18 InnoDB Backup and Recovery](innodb-backup-recovery.html)
:   [17.18.1 InnoDB Backup](innodb-backup.html)

    [17.18.2 InnoDB Recovery](innodb-recovery.html)

[17.19 InnoDB and MySQL Replication](innodb-and-mysql-replication.html)

[17.20 InnoDB Troubleshooting](innodb-troubleshooting.html)
:   [17.20.1 Troubleshooting InnoDB I/O Problems](error-creating-innodb.html)

    [17.20.2 Troubleshooting Recovery Failures](innodb-troubleshooting-recovery.html)

    [17.20.3 Forcing InnoDB Recovery](forcing-innodb-recovery.html)

    [17.20.4 Troubleshooting InnoDB Data Dictionary Operations](innodb-troubleshooting-datadict.html)

    [17.20.5 InnoDB Error Handling](innodb-error-handling.html)

[17.21 InnoDB Limits](innodb-limits.html)

[17.22 InnoDB Restrictions and Limitations](innodb-restrictions-limitations.html)