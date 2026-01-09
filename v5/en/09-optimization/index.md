# Chapter 8 Optimization

**Table of Contents**

8.1 Optimization Overview

8.2 Optimizing SQL Statements :   8.2.1 Optimizing SELECT Statements

    8.2.2 Optimizing Subqueries, Derived Tables, and View References

    8.2.3 Optimizing INFORMATION_SCHEMA Queries

    8.2.4 Optimizing Data Change Statements

    8.2.5 Optimizing Database Privileges

    8.2.6 Other Optimization Tips

8.3 Optimization and Indexes :   8.3.1 How MySQL Uses Indexes

    8.3.2 Primary Key Optimization

    8.3.3 Foreign Key Optimization

    8.3.4 Column Indexes

    8.3.5 Multiple-Column Indexes

    8.3.6 Verifying Index Usage

    8.3.7 InnoDB and MyISAM Index Statistics Collection

    8.3.8 Comparison of B-Tree and Hash Indexes

    8.3.9 Use of Index Extensions

    8.3.10 Optimizer Use of Generated Column Indexes

    8.3.11 Indexed Lookups from TIMESTAMP Columns

8.4 Optimizing Database Structure :   8.4.1 Optimizing Data Size

    8.4.2 Optimizing MySQL Data Types

    8.4.3 Optimizing for Many Tables

    8.4.4 Internal Temporary Table Use in MySQL

    8.4.5 Limits on Number of Databases and Tables

    8.4.6 Limits on Table Size

    8.4.7 Limits on Table Column Count and Row Size

8.5 Optimizing for InnoDB Tables :   8.5.1 Optimizing Storage Layout for InnoDB Tables

    8.5.2 Optimizing InnoDB Transaction Management

    8.5.3 Optimizing InnoDB Read-Only Transactions

    8.5.4 Optimizing InnoDB Redo Logging

    8.5.5 Bulk Data Loading for InnoDB Tables

    8.5.6 Optimizing InnoDB Queries

    8.5.7 Optimizing InnoDB DDL Operations

    8.5.8 Optimizing InnoDB Disk I/O

    8.5.9 Optimizing InnoDB Configuration Variables

    8.5.10 Optimizing InnoDB for Systems with Many Tables

8.6 Optimizing for MyISAM Tables :   8.6.1 Optimizing MyISAM Queries

    8.6.2 Bulk Data Loading for MyISAM Tables

    8.6.3 Optimizing REPAIR TABLE Statements

8.7 Optimizing for MEMORY Tables

8.8 Understanding the Query Execution Plan :   8.8.1 Optimizing Queries with EXPLAIN

    8.8.2 EXPLAIN Output Format

    8.8.3 Extended EXPLAIN Output Format

    8.8.4 Obtaining Execution Plan Information for a Named Connection

    8.8.5 Estimating Query Performance

8.9 Controlling the Query Optimizer :   8.9.1 Controlling Query Plan Evaluation

    8.9.2 Switchable Optimizations

    8.9.3 Optimizer Hints

    8.9.4 Index Hints

    8.9.5 The Optimizer Cost Model

8.10 Buffering and Caching :   8.10.1 InnoDB Buffer Pool Optimization

    8.10.2 The MyISAM Key Cache

    8.10.3 The MySQL Query Cache

    8.10.4 Caching of Prepared Statements and Stored Programs

8.11 Optimizing Locking Operations :   8.11.1 Internal Locking Methods

    8.11.2 Table Locking Issues

    8.11.3 Concurrent Inserts

    8.11.4 Metadata Locking

    8.11.5 External Locking

8.12 Optimizing the MySQL Server :   8.12.1 System Factors

    8.12.2 Optimizing Disk I/O

    8.12.3 Using Symbolic Links

    8.12.4 Optimizing Memory Use

8.13 Measuring Performance (Benchmarking) :   8.13.1 Measuring the Speed of Expressions and Functions

    8.13.2 Using Your Own Benchmarks

    8.13.3 Measuring Performance with performance_schema

8.14 Examining Server Thread (Process) Information :   8.14.1 Accessing the Process List

    8.14.2 Thread Command Values

    8.14.3 General Thread States

    8.14.4 Query Cache Thread States

    8.14.5 Replication Source Thread States

    8.14.6 Replication Replica I/O Thread States

    8.14.7 Replication Replica SQL Thread States

    8.14.8 Replication Replica Connection Thread States

    8.14.9 NDB Cluster Thread States

    8.14.10 Event Scheduler Thread States

8.15 Tracing the Optimizer :   8.15.1 Typical Usage

    8.15.2 System Variables Controlling Tracing

    8.15.3 Traceable Statements

    8.15.4 Tuning Trace Purging

    8.15.5 Tracing Memory Usage

    8.15.6 Privilege Checking

    8.15.7 Interaction with the --debug Option

    8.15.8 The optimizer_trace System Variable

    8.15.9 The end_markers_in_json System Variable

    8.15.10 Selecting Optimizer Features to Trace

    8.15.11 Trace General Structure

    8.15.12 Example

    8.15.13 Displaying Traces in Other Applications

    8.15.14 Preventing the Use of Optimizer Trace

    8.15.15 Testing Optimizer Trace

    8.15.16 Optimizer Trace Implementation

This chapter explains how to optimize MySQL performance and provides examples. Optimization involves configuring, tuning, and measuring performance, at several levels. Depending on your job role (developer, DBA, or a combination of both), you might optimize at the level of individual SQL statements, entire applications, a single database server, or multiple networked database servers. Sometimes you can be proactive and plan in advance for performance, while other times you might troubleshoot a configuration or code issue after a problem occurs. Optimizing CPU and memory usage can also improve scalability, allowing the database to handle more load without slowing down.
