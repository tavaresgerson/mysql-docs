# Chapter 17 The InnoDB Storage Engine

**Table of Contents**

17.1 Introduction to InnoDB :   17.1.1 Benefits of Using InnoDB Tables

    17.1.2 Best Practices for InnoDB Tables

    17.1.3 Verifying that InnoDB is the Default Storage Engine

    17.1.4 Testing and Benchmarking with InnoDB

17.2 InnoDB and the ACID Model

17.3 InnoDB Multi-Versioning

17.4 InnoDB Architecture

17.5 InnoDB In-Memory Structures :   17.5.1 Buffer Pool

    17.5.2 Change Buffer

    17.5.3 Adaptive Hash Index

    17.5.4 Log Buffer

17.6 InnoDB On-Disk Structures :   17.6.1 Tables

    17.6.2 Indexes

    17.6.3 Tablespaces

    17.6.4 Doublewrite Buffer

    17.6.5 Redo Log

    17.6.6 Undo Logs

17.7 InnoDB Locking and Transaction Model :   17.7.1 InnoDB Locking

    17.7.2 InnoDB Transaction Model

    17.7.3 Locks Set by Different SQL Statements in InnoDB

    17.7.4 Phantom Rows

    17.7.5 Deadlocks in InnoDB

    17.7.6 Transaction Scheduling

17.8 InnoDB Configuration :   17.8.1 InnoDB Startup Configuration

    17.8.2 Configuring InnoDB for Read-Only Operation

    17.8.3 InnoDB Buffer Pool Configuration

    17.8.4 Configuring Thread Concurrency for InnoDB

    17.8.5 Configuring the Number of Background InnoDB I/O Threads

    17.8.6 Using Asynchronous I/O on Linux

    17.8.7 Configuring InnoDB I/O Capacity

    17.8.8 Configuring Spin Lock Polling

    17.8.9 Purge Configuration

    17.8.10 Configuring Optimizer Statistics for InnoDB

    17.8.11 Configuring the Merge Threshold for Index Pages

    17.8.12 Container Detection and Configuration

    17.8.13 Enabling Automatic InnoDB Configuration for a Dedicated MySQL Server

17.9 InnoDB Table and Page Compression :   17.9.1 InnoDB Table Compression

    17.9.2 InnoDB Page Compression

17.10 InnoDB Row Formats

17.11 InnoDB Disk I/O and File Space Management :   17.11.1 InnoDB Disk I/O

    17.11.2 File Space Management

    17.11.3 InnoDB Checkpoints

    17.11.4 Defragmenting a Table

    17.11.5 Reclaiming Disk Space with TRUNCATE TABLE

17.12 InnoDB and Online DDL :   17.12.1 Online DDL Operations

    17.12.2 Online DDL Performance and Concurrency

    17.12.3 Online DDL Space Requirements

    17.12.4 Online DDL Memory Management

    17.12.5 Configuring Parallel Threads for Online DDL Operations

    17.12.6 Simplifying DDL Statements with Online DDL

    17.12.7 Online DDL Failure Conditions

    17.12.8 Online DDL Limitations

17.13 InnoDB Data-at-Rest Encryption

17.14 InnoDB Startup Options and System Variables

17.15 InnoDB INFORMATION_SCHEMA Tables :   17.15.1 InnoDB INFORMATION_SCHEMA Tables about Compression

    17.15.2 InnoDB INFORMATION_SCHEMA Transaction and Locking Information

    17.15.3 InnoDB INFORMATION_SCHEMA Schema Object Tables

    17.15.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables

    17.15.5 InnoDB INFORMATION_SCHEMA Buffer Pool Tables

    17.15.6 InnoDB INFORMATION_SCHEMA Metrics Table

    17.15.7 InnoDB INFORMATION_SCHEMA Temporary Table Info Table

    17.15.8 Retrieving InnoDB Tablespace Metadata from INFORMATION_SCHEMA.FILES

17.16 InnoDB Integration with MySQL Performance Schema :   17.16.1 Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema

    17.16.2 Monitoring InnoDB Mutex Waits Using Performance Schema

17.17 InnoDB Monitors :   17.17.1 InnoDB Monitor Types

    17.17.2 Enabling InnoDB Monitors

    17.17.3 InnoDB Standard Monitor and Lock Monitor Output

17.18 InnoDB Backup and Recovery :   17.18.1 InnoDB Backup

    17.18.2 InnoDB Recovery

17.19 InnoDB and MySQL Replication

17.20 InnoDB Troubleshooting :   17.20.1 Troubleshooting InnoDB I/O Problems

    17.20.2 Troubleshooting Recovery Failures

    17.20.3 Forcing InnoDB Recovery

    17.20.4 Troubleshooting InnoDB Data Dictionary Operations

    17.20.5 InnoDB Error Handling

17.21 InnoDB Limits

17.22 InnoDB Restrictions and Limitations
