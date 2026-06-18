# Chapter 14 The InnoDB Storage Engine

**Table of Contents**

[14.1 Introduction to InnoDB](innodb-introduction.html)
:   [14.1.1 Benefits of Using InnoDB Tables](innodb-benefits.html)

    [14.1.2 Best Practices for InnoDB Tables](innodb-best-practices.html)

    [14.1.3 Verifying that InnoDB is the Default Storage Engine](innodb-check-availability.html)

    [14.1.4 Testing and Benchmarking with InnoDB](innodb-benchmarking.html)

    [14.1.5 Turning Off InnoDB](innodb-turning-off.html)

[14.2 InnoDB and the ACID Model](mysql-acid.html)

[14.3 InnoDB Multi-Versioning](innodb-multi-versioning.html)

[14.4 InnoDB Architecture](innodb-architecture.html)

[14.5 InnoDB In-Memory Structures](innodb-in-memory-structures.html)
:   [14.5.1 Buffer Pool](innodb-buffer-pool.html)

    [14.5.2 Change Buffer](innodb-change-buffer.html)

    [14.5.3 Adaptive Hash Index](innodb-adaptive-hash.html)

    [14.5.4 Log Buffer](innodb-redo-log-buffer.html)

[14.6 InnoDB On-Disk Structures](innodb-on-disk-structures.html)
:   [14.6.1 Tables](innodb-tables.html)

    [14.6.2 Indexes](innodb-indexes.html)

    [14.6.3 Tablespaces](innodb-tablespace.html)

    [14.6.4 InnoDB Data Dictionary](innodb-data-dictionary.html)

    [14.6.5 Doublewrite Buffer](innodb-doublewrite-buffer.html)

    [14.6.6 Redo Log](innodb-redo-log.html)

    [14.6.7 Undo Logs](innodb-undo-logs.html)

[14.7 InnoDB Locking and Transaction Model](innodb-locking-transaction-model.html)
:   [14.7.1 InnoDB Locking](innodb-locking.html)

    [14.7.2 InnoDB Transaction Model](innodb-transaction-model.html)

    [14.7.3 Locks Set by Different SQL Statements in InnoDB](innodb-locks-set.html)

    [14.7.4 Phantom Rows](innodb-next-key-locking.html)

    [14.7.5 Deadlocks in InnoDB](innodb-deadlocks.html)

[14.8 InnoDB Configuration](innodb-configuration.html)
:   [14.8.1 InnoDB Startup Configuration](innodb-init-startup-configuration.html)

    [14.8.2 Configuring InnoDB for Read-Only Operation](innodb-read-only-instance.html)

    [14.8.3 InnoDB Buffer Pool Configuration](innodb-performance-buffer-pool.html)

    [14.8.4 Configuring the Memory Allocator for InnoDB](innodb-performance-use_sys_malloc.html)

    [14.8.5 Configuring Thread Concurrency for InnoDB](innodb-performance-thread_concurrency.html)

    [14.8.6 Configuring the Number of Background InnoDB I/O Threads](innodb-performance-multiple_io_threads.html)

    [14.8.7 Using Asynchronous I/O on Linux](innodb-linux-native-aio.html)

    [14.8.8 Configuring InnoDB I/O Capacity](innodb-configuring-io-capacity.html)

    [14.8.9 Configuring Spin Lock Polling](innodb-performance-spin_lock_polling.html)

    [14.8.10 Purge Configuration](innodb-purge-configuration.html)

    [14.8.11 Configuring Optimizer Statistics for InnoDB](innodb-performance-optimizer-statistics.html)

    [14.8.12 Configuring the Merge Threshold for Index Pages](index-page-merge-threshold.html)

[14.9 InnoDB Table and Page Compression](innodb-compression.html)
:   [14.9.1 InnoDB Table Compression](innodb-table-compression.html)

    [14.9.2 InnoDB Page Compression](innodb-page-compression.html)

[14.10 InnoDB File-Format Management](innodb-file-format.html)
:   [14.10.1 Enabling File Formats](innodb-file-format-enabling.html)

    [14.10.2 Verifying File Format Compatibility](innodb-file-format-compatibility.html)

    [14.10.3 Identifying the File Format in Use](innodb-file-format-identifying.html)

    [14.10.4 Modifying the File Format](innodb-file-format-downgrading.html)

[14.11 InnoDB Row Formats](innodb-row-format.html)

[14.12 InnoDB Disk I/O and File Space Management](innodb-disk-management.html)
:   [14.12.1 InnoDB Disk I/O](innodb-disk-io.html)

    [14.12.2 File Space Management](innodb-file-space.html)

    [14.12.3 InnoDB Checkpoints](innodb-checkpoints.html)

    [14.12.4 Defragmenting a Table](innodb-file-defragmenting.html)

    [14.12.5 Reclaiming Disk Space with TRUNCATE TABLE](innodb-truncate-table-reclaim-space.html)

[14.13 InnoDB and Online DDL](innodb-online-ddl.html)
:   [14.13.1 Online DDL Operations](innodb-online-ddl-operations.html)

    [14.13.2 Online DDL Performance and Concurrency](innodb-online-ddl-performance.html)

    [14.13.3 Online DDL Space Requirements](innodb-online-ddl-space-requirements.html)

    [14.13.4 Simplifying DDL Statements with Online DDL](innodb-online-ddl-single-multi.html)

    [14.13.5 Online DDL Failure Conditions](innodb-online-ddl-failure-conditions.html)

    [14.13.6 Online DDL Limitations](innodb-online-ddl-limitations.html)

[14.14 InnoDB Data-at-Rest Encryption](innodb-data-encryption.html)

[14.15 InnoDB Startup Options and System Variables](innodb-parameters.html)

[14.16 InnoDB INFORMATION\_SCHEMA Tables](innodb-information-schema.html)
:   [14.16.1 InnoDB INFORMATION\_SCHEMA Tables about Compression](innodb-information-schema-compression-tables.html)

    [14.16.2 InnoDB INFORMATION\_SCHEMA Transaction and Locking Information](innodb-information-schema-transactions.html)

    [14.16.3 InnoDB INFORMATION\_SCHEMA System Tables](innodb-information-schema-system-tables.html)

    [14.16.4 InnoDB INFORMATION\_SCHEMA FULLTEXT Index Tables](innodb-information-schema-fulltext_index-tables.html)

    [14.16.5 InnoDB INFORMATION\_SCHEMA Buffer Pool Tables](innodb-information-schema-buffer-pool-tables.html)

    [14.16.6 InnoDB INFORMATION\_SCHEMA Metrics Table](innodb-information-schema-metrics-table.html)

    [14.16.7 InnoDB INFORMATION\_SCHEMA Temporary Table Info Table](innodb-information-schema-temp-table-info.html)

    [14.16.8 Retrieving InnoDB Tablespace Metadata from INFORMATION\_SCHEMA.FILES](innodb-information-schema-files-table.html)

[14.17 InnoDB Integration with MySQL Performance Schema](innodb-performance-schema.html)
:   [14.17.1 Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema](monitor-alter-table-performance-schema.html)

    [14.17.2 Monitoring InnoDB Mutex Waits Using Performance Schema](monitor-innodb-mutex-waits-performance-schema.html)

[14.18 InnoDB Monitors](innodb-monitors.html)
:   [14.18.1 InnoDB Monitor Types](innodb-monitor-types.html)

    [14.18.2 Enabling InnoDB Monitors](innodb-enabling-monitors.html)

    [14.18.3 InnoDB Standard Monitor and Lock Monitor Output](innodb-standard-monitor.html)

[14.19 InnoDB Backup and Recovery](innodb-backup-recovery.html)
:   [14.19.1 InnoDB Backup](innodb-backup.html)

    [14.19.2 InnoDB Recovery](innodb-recovery.html)

[14.20 InnoDB and MySQL Replication](innodb-and-mysql-replication.html)

[14.21 InnoDB memcached Plugin](innodb-memcached.html)
:   [14.21.1 Benefits of the InnoDB memcached Plugin](innodb-memcached-benefits.html)

    [14.21.2 InnoDB memcached Architecture](innodb-memcached-intro.html)

    [14.21.3 Setting Up the InnoDB memcached Plugin](innodb-memcached-setup.html)

    [14.21.4 Security Considerations for the InnoDB memcached Plugin](innodb-memcached-security.html)

    [14.21.5 Writing Applications for the InnoDB memcached Plugin](innodb-memcached-developing.html)

    [14.21.6 The InnoDB memcached Plugin and Replication](innodb-memcached-replication.html)

    [14.21.7 InnoDB memcached Plugin Internals](innodb-memcached-internals.html)

    [14.21.8 Troubleshooting the InnoDB memcached Plugin](innodb-memcached-troubleshoot.html)

[14.22 InnoDB Troubleshooting](innodb-troubleshooting.html)
:   [14.22.1 Troubleshooting InnoDB I/O Problems](error-creating-innodb.html)

    [14.22.2 Forcing InnoDB Recovery](forcing-innodb-recovery.html)

    [14.22.3 Troubleshooting InnoDB Data Dictionary Operations](innodb-troubleshooting-datadict.html)

    [14.22.4 InnoDB Error Handling](innodb-error-handling.html)

[14.23 InnoDB Limits](innodb-limits.html)

[14.24 InnoDB Restrictions and Limitations](innodb-restrictions-limitations.html)