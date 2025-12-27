# Chapter 10 Optimization

**Table of Contents**

10.1 Optimization Overview

10.2 Optimizing SQL Statements :   10.2.1 Optimizing SELECT Statements

    10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions

    10.2.3 Optimizing INFORMATION\_SCHEMA Queries

    10.2.4 Optimizing Performance Schema Queries

    10.2.5 Optimizing Data Change Statements

    10.2.6 Optimizing Database Privileges

    10.2.7 Other Optimization Tips

10.3 Optimization and Indexes :   10.3.1 How MySQL Uses Indexes

    10.3.2 Primary Key Optimization

    10.3.3 SPATIAL Index Optimization

    10.3.4 Foreign Key Optimization

    10.3.5 Column Indexes

    10.3.6 Multiple-Column Indexes

    10.3.7 Verifying Index Usage

    10.3.8 InnoDB and MyISAM Index Statistics Collection

    10.3.9 Comparison of B-Tree and Hash Indexes

    10.3.10 Use of Index Extensions

    10.3.11 Optimizer Use of Generated Column Indexes

    10.3.12 Invisible Indexes

    10.3.13 Descending Indexes

    10.3.14 Indexed Lookups from TIMESTAMP Columns

10.4 Optimizing Database Structure :   10.4.1 Optimizing Data Size

    10.4.2 Optimizing MySQL Data Types

    10.4.3 Optimizing for Many Tables

    10.4.4 Internal Temporary Table Use in MySQL

    10.4.5 Limits on Number of Databases and Tables

    10.4.6 Limits on Table Size

    10.4.7 Limits on Table Column Count and Row Size

10.5 Optimizing for InnoDB Tables :   10.5.1 Optimizing Storage Layout for InnoDB Tables

    10.5.2 Optimizing InnoDB Transaction Management

    10.5.3 Optimizing InnoDB Read-Only Transactions

    10.5.4 Optimizing InnoDB Redo Logging

    10.5.5 Bulk Data Loading for InnoDB Tables

    10.5.6 Optimizing InnoDB Queries

    10.5.7 Optimizing InnoDB DDL Operations

    10.5.8 Optimizing InnoDB Disk I/O

    10.5.9 Optimizing InnoDB Configuration Variables

    10.5.10 Optimizing InnoDB for Systems with Many Tables

10.6 Optimizing for MyISAM Tables :   10.6.1 Optimizing MyISAM Queries

    10.6.2 Bulk Data Loading for MyISAM Tables

    10.6.3 Optimizing REPAIR TABLE Statements

10.7 Optimizing for MEMORY Tables

10.8 Understanding the Query Execution Plan :   10.8.1 Optimizing Queries with EXPLAIN

    10.8.2 EXPLAIN Output Format

    10.8.3 Extended EXPLAIN Output Format

    10.8.4 Obtaining Execution Plan Information for a Named Connection

    10.8.5 Estimating Query Performance

10.9 Controlling the Query Optimizer :   10.9.1 Controlling Query Plan Evaluation

    10.9.2 Switchable Optimizations

    10.9.3 Optimizer Hints

    10.9.4 Index Hints

    10.9.5 The Optimizer Cost Model

    10.9.6 Optimizer Statistics

10.10 Buffering and Caching :   10.10.1 InnoDB Buffer Pool Optimization

    10.10.2 The MyISAM Key Cache

    10.10.3 Caching of Prepared Statements and Stored Programs

10.11 Optimizing Locking Operations :   10.11.1 Internal Locking Methods

    10.11.2 Table Locking Issues

    10.11.3 Concurrent Inserts

    10.11.4 Metadata Locking

    10.11.5 External Locking

10.12 Optimizing the MySQL Server :   10.12.1 Optimizing Disk I/O

    10.12.2 Using Symbolic Links

    10.12.3 Optimizing Memory Use

10.13 Measuring Performance (Benchmarking) :   10.13.1 Measuring the Speed of Expressions and Functions

    10.13.2 Using Your Own Benchmarks

    10.13.3 Measuring Performance with performance\_schema

10.14 Examining Server Thread (Process) Information :   10.14.1 Accessing the Process List

    10.14.2 Thread Command Values

    10.14.3 General Thread States

    10.14.4 Replication Source Thread States

    10.14.5 Replication I/O (Receiver) Thread States

    10.14.6 Replication SQL Thread States

    10.14.7 Replication Connection Thread States

    10.14.8 NDB Cluster Thread States

    10.14.9 Event Scheduler Thread States

10.15 Tracing the Optimizer :   10.15.1 Typical Usage

    10.15.2 System Variables Controlling Tracing

    10.15.3 Traceable Statements

    10.15.4 Tuning Trace Purging

    10.15.5 Tracing Memory Usage

    10.15.6 Privilege Checking

    10.15.7 Interaction with the --debug Option

    10.15.8 The optimizer\_trace System Variable

    10.15.9 The end\_markers\_in\_json System Variable

    10.15.10 Selecting Optimizer Features to Trace

    10.15.11 Trace General Structure

    10.15.12 Example

    10.15.13 Displaying Traces in Other Applications

    10.15.14 Preventing the Use of Optimizer Trace

    10.15.15 Testing Optimizer Trace

    10.15.16 Optimizer Trace Implementation

This chapter explains how to optimize MySQL performance and provides examples. Optimization involves configuring, tuning, and measuring performance, at several levels. Depending on your job role (developer, DBA, or a combination of both), you might optimize at the level of individual SQL statements, entire applications, a single database server, or multiple networked database servers. Sometimes you can be proactive and plan in advance for performance, while other times you might troubleshoot a configuration or code issue after a problem occurs. Optimizing CPU and memory usage can also improve scalability, allowing the database to handle more load without slowing down.
