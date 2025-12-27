# Chapter 14 The InnoDB Storage Engine

**Table of Contents**

14.1 Introduction to InnoDB :   14.1.1 Benefits of Using InnoDB Tables

    14.1.2 Best Practices for InnoDB Tables

    14.1.3 Verifying that InnoDB is the Default Storage Engine

    14.1.4 Testing and Benchmarking with InnoDB

    14.1.5 Turning Off InnoDB

14.2 InnoDB and the ACID Model

14.3 InnoDB Multi-Versioning

14.4 InnoDB Architecture

14.5 InnoDB In-Memory Structures :   14.5.1 Buffer Pool

    14.5.2 Change Buffer

    14.5.3 Adaptive Hash Index

    14.5.4 Log Buffer

14.6 InnoDB On-Disk Structures :   14.6.1 Tables

    14.6.2 Indexes

    14.6.3 Tablespaces

    14.6.4 InnoDB Data Dictionary

    14.6.5 Doublewrite Buffer

    14.6.6 Redo Log

    14.6.7 Undo Logs

14.7 InnoDB Locking and Transaction Model :   14.7.1 InnoDB Locking

    14.7.2 InnoDB Transaction Model

    14.7.3 Locks Set by Different SQL Statements in InnoDB

    14.7.4 Phantom Rows

    14.7.5 Deadlocks in InnoDB

14.8 InnoDB Configuration :   14.8.1 InnoDB Startup Configuration

    14.8.2 Configuring InnoDB for Read-Only Operation

    14.8.3 InnoDB Buffer Pool Configuration

    14.8.4 Configuring the Memory Allocator for InnoDB

    14.8.5 Configuring Thread Concurrency for InnoDB

    14.8.6 Configuring the Number of Background InnoDB I/O Threads

    14.8.7 Using Asynchronous I/O on Linux

    14.8.8 Configuring InnoDB I/O Capacity

    14.8.9 Configuring Spin Lock Polling

    14.8.10 Purge Configuration

    14.8.11 Configuring Optimizer Statistics for InnoDB

    14.8.12 Configuring the Merge Threshold for Index Pages

14.9 InnoDB Table and Page Compression :   14.9.1 InnoDB Table Compression

    14.9.2 InnoDB Page Compression

14.10 InnoDB File-Format Management :   14.10.1 Enabling File Formats

    14.10.2 Verifying File Format Compatibility

    14.10.3 Identifying the File Format in Use

    14.10.4 Modifying the File Format

14.11 InnoDB Row Formats

14.12 InnoDB Disk I/O and File Space Management :   14.12.1 InnoDB Disk I/O

    14.12.2 File Space Management

    14.12.3 InnoDB Checkpoints

    14.12.4 Defragmenting a Table

    14.12.5 Reclaiming Disk Space with TRUNCATE TABLE

14.13 InnoDB and Online DDL :   14.13.1 Online DDL Operations

    14.13.2 Online DDL Performance and Concurrency

    14.13.3 Online DDL Space Requirements

    14.13.4 Simplifying DDL Statements with Online DDL

    14.13.5 Online DDL Failure Conditions

    14.13.6 Online DDL Limitations

14.14 InnoDB Data-at-Rest Encryption

14.15 InnoDB Startup Options and System Variables

14.16 InnoDB INFORMATION\_SCHEMA Tables :   14.16.1 InnoDB INFORMATION\_SCHEMA Tables about Compression

    14.16.2 InnoDB INFORMATION\_SCHEMA Transaction and Locking Information

    14.16.3 InnoDB INFORMATION\_SCHEMA System Tables

    14.16.4 InnoDB INFORMATION\_SCHEMA FULLTEXT Index Tables

    14.16.5 InnoDB INFORMATION\_SCHEMA Buffer Pool Tables

    14.16.6 InnoDB INFORMATION\_SCHEMA Metrics Table

    14.16.7 InnoDB INFORMATION\_SCHEMA Temporary Table Info Table

    14.16.8 Retrieving InnoDB Tablespace Metadata from INFORMATION\_SCHEMA.FILES

14.17 InnoDB Integration with MySQL Performance Schema :   14.17.1 Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema

    14.17.2 Monitoring InnoDB Mutex Waits Using Performance Schema

14.18 InnoDB Monitors :   14.18.1 InnoDB Monitor Types

    14.18.2 Enabling InnoDB Monitors

    14.18.3 InnoDB Standard Monitor and Lock Monitor Output

14.19 InnoDB Backup and Recovery :   14.19.1 InnoDB Backup

    14.19.2 InnoDB Recovery

14.20 InnoDB and MySQL Replication

14.21 InnoDB memcached Plugin :   14.21.1 Benefits of the InnoDB memcached Plugin

    14.21.2 InnoDB memcached Architecture

    14.21.3 Setting Up the InnoDB memcached Plugin

    14.21.4 Security Considerations for the InnoDB memcached Plugin

    14.21.5 Writing Applications for the InnoDB memcached Plugin

    14.21.6 The InnoDB memcached Plugin and Replication

    14.21.7 InnoDB memcached Plugin Internals

    14.21.8 Troubleshooting the InnoDB memcached Plugin

14.22 InnoDB Troubleshooting :   14.22.1 Troubleshooting InnoDB I/O Problems

    14.22.2 Forcing InnoDB Recovery

    14.22.3 Troubleshooting InnoDB Data Dictionary Operations

    14.22.4 InnoDB Error Handling

14.23 InnoDB Limits

14.24 InnoDB Restrictions and Limitations
