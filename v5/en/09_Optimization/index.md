# Chapter 8 Optimization

**Table of Contents**

[8.1 Optimization Overview](optimize-overview.html)

[8.2 Optimizing SQL Statements](statement-optimization.html)
:   [8.2.1 Optimizing SELECT Statements](select-optimization.html)

    [8.2.2 Optimizing Subqueries, Derived Tables, and View References](subquery-optimization.html)

    [8.2.3 Optimizing INFORMATION\_SCHEMA Queries](information-schema-optimization.html)

    [8.2.4 Optimizing Data Change Statements](data-change-optimization.html)

    [8.2.5 Optimizing Database Privileges](permission-optimization.html)

    [8.2.6 Other Optimization Tips](miscellaneous-optimization-tips.html)

[8.3 Optimization and Indexes](optimization-indexes.html)
:   [8.3.1 How MySQL Uses Indexes](mysql-indexes.html)

    [8.3.2 Primary Key Optimization](primary-key-optimization.html)

    [8.3.3 Foreign Key Optimization](foreign-key-optimization.html)

    [8.3.4 Column Indexes](column-indexes.html)

    [8.3.5 Multiple-Column Indexes](multiple-column-indexes.html)

    [8.3.6 Verifying Index Usage](verifying-index-usage.html)

    [8.3.7 InnoDB and MyISAM Index Statistics Collection](index-statistics.html)

    [8.3.8 Comparison of B-Tree and Hash Indexes](index-btree-hash.html)

    [8.3.9 Use of Index Extensions](index-extensions.html)

    [8.3.10 Optimizer Use of Generated Column Indexes](generated-column-index-optimizations.html)

    [8.3.11 Indexed Lookups from TIMESTAMP Columns](timestamp-lookups.html)

[8.4 Optimizing Database Structure](optimizing-database-structure.html)
:   [8.4.1 Optimizing Data Size](data-size.html)

    [8.4.2 Optimizing MySQL Data Types](optimize-data-types.html)

    [8.4.3 Optimizing for Many Tables](optimize-multi-tables.html)

    [8.4.4 Internal Temporary Table Use in MySQL](internal-temporary-tables.html)

    [8.4.5 Limits on Number of Databases and Tables](database-count-limit.html)

    [8.4.6 Limits on Table Size](table-size-limit.html)

    [8.4.7 Limits on Table Column Count and Row Size](column-count-limit.html)

[8.5 Optimizing for InnoDB Tables](optimizing-innodb.html)
:   [8.5.1 Optimizing Storage Layout for InnoDB Tables](optimizing-innodb-storage-layout.html)

    [8.5.2 Optimizing InnoDB Transaction Management](optimizing-innodb-transaction-management.html)

    [8.5.3 Optimizing InnoDB Read-Only Transactions](innodb-performance-ro-txn.html)

    [8.5.4 Optimizing InnoDB Redo Logging](optimizing-innodb-logging.html)

    [8.5.5 Bulk Data Loading for InnoDB Tables](optimizing-innodb-bulk-data-loading.html)

    [8.5.6 Optimizing InnoDB Queries](optimizing-innodb-queries.html)

    [8.5.7 Optimizing InnoDB DDL Operations](optimizing-innodb-ddl-operations.html)

    [8.5.8 Optimizing InnoDB Disk I/O](optimizing-innodb-diskio.html)

    [8.5.9 Optimizing InnoDB Configuration Variables](optimizing-innodb-configuration-variables.html)

    [8.5.10 Optimizing InnoDB for Systems with Many Tables](optimizing-innodb-many-tables.html)

[8.6 Optimizing for MyISAM Tables](optimizing-myisam.html)
:   [8.6.1 Optimizing MyISAM Queries](optimizing-queries-myisam.html)

    [8.6.2 Bulk Data Loading for MyISAM Tables](optimizing-myisam-bulk-data-loading.html)

    [8.6.3 Optimizing REPAIR TABLE Statements](repair-table-optimization.html)

[8.7 Optimizing for MEMORY Tables](optimizing-memory-tables.html)

[8.8 Understanding the Query Execution Plan](execution-plan-information.html)
:   [8.8.1 Optimizing Queries with EXPLAIN](using-explain.html)

    [8.8.2 EXPLAIN Output Format](explain-output.html)

    [8.8.3 Extended EXPLAIN Output Format](explain-extended.html)

    [8.8.4 Obtaining Execution Plan Information for a Named Connection](explain-for-connection.html)

    [8.8.5 Estimating Query Performance](estimating-performance.html)

[8.9 Controlling the Query Optimizer](controlling-optimizer.html)
:   [8.9.1 Controlling Query Plan Evaluation](controlling-query-plan-evaluation.html)

    [8.9.2 Switchable Optimizations](switchable-optimizations.html)

    [8.9.3 Optimizer Hints](optimizer-hints.html)

    [8.9.4 Index Hints](index-hints.html)

    [8.9.5 The Optimizer Cost Model](cost-model.html)

[8.10 Buffering and Caching](buffering-caching.html)
:   [8.10.1 InnoDB Buffer Pool Optimization](innodb-buffer-pool-optimization.html)

    [8.10.2 The MyISAM Key Cache](myisam-key-cache.html)

    [8.10.3 The MySQL Query Cache](query-cache.html)

    [8.10.4 Caching of Prepared Statements and Stored Programs](statement-caching.html)

[8.11 Optimizing Locking Operations](locking-issues.html)
:   [8.11.1 Internal Locking Methods](internal-locking.html)

    [8.11.2 Table Locking Issues](table-locking.html)

    [8.11.3 Concurrent Inserts](concurrent-inserts.html)

    [8.11.4 Metadata Locking](metadata-locking.html)

    [8.11.5 External Locking](external-locking.html)

[8.12 Optimizing the MySQL Server](optimizing-server.html)
:   [8.12.1 System Factors](system-optimization.html)

    [8.12.2 Optimizing Disk I/O](disk-issues.html)

    [8.12.3 Using Symbolic Links](symbolic-links.html)

    [8.12.4 Optimizing Memory Use](optimizing-memory.html)

[8.13 Measuring Performance (Benchmarking)](optimize-benchmarking.html)
:   [8.13.1 Measuring the Speed of Expressions and Functions](select-benchmarking.html)

    [8.13.2 Using Your Own Benchmarks](custom-benchmarks.html)

    [8.13.3 Measuring Performance with performance\_schema](monitoring-performance-schema.html)

[8.14 Examining Server Thread (Process) Information](thread-information.html)
:   [8.14.1 Accessing the Process List](processlist-access.html)

    [8.14.2 Thread Command Values](thread-commands.html)

    [8.14.3 General Thread States](general-thread-states.html)

    [8.14.4 Query Cache Thread States](query-cache-thread-states.html)

    [8.14.5 Replication Source Thread States](source-thread-states.html)

    [8.14.6 Replication Replica I/O Thread States](replica-io-thread-states.html)

    [8.14.7 Replication Replica SQL Thread States](replica-sql-thread-states.html)

    [8.14.8 Replication Replica Connection Thread States](replica-connection-thread-states.html)

    [8.14.9 NDB Cluster Thread States](mysql-cluster-thread-states.html)

    [8.14.10 Event Scheduler Thread States](event-scheduler-thread-states.html)

[8.15 Tracing the Optimizer](optimizer-tracing.html)
:   [8.15.1 Typical Usage](optimizer-tracing-typical-usage.html)

    [8.15.2 System Variables Controlling Tracing](system-variables-controlling-tracing.html)

    [8.15.3 Traceable Statements](traceable-statements.html)

    [8.15.4 Tuning Trace Purging](tuning-trace-purging.html)

    [8.15.5 Tracing Memory Usage](tracing-memory-usage.html)

    [8.15.6 Privilege Checking](privilege-checking.html)

    [8.15.7 Interaction with the --debug Option](interaction-with-debug-option.html)

    [8.15.8 The optimizer\_trace System Variable](optimizer-trace-system-variable.html)

    [8.15.9 The end\_markers\_in\_json System Variable](end-markers-in-json-system-variable.html)

    [8.15.10 Selecting Optimizer Features to Trace](optimizer-features-to-trace.html)

    [8.15.11 Trace General Structure](trace-general-structure.html)

    [8.15.12 Example](tracing-example.html)

    [8.15.13 Displaying Traces in Other Applications](displaying-traces.html)

    [8.15.14 Preventing the Use of Optimizer Trace](preventing-use-of-optimizer-trace.html)

    [8.15.15 Testing Optimizer Trace](optimizer-trace-testing.html)

    [8.15.16 Optimizer Trace Implementation](optimizer-trace-implementation.html)

This chapter explains how to optimize MySQL performance and provides
examples. Optimization involves configuring, tuning, and measuring
performance, at several levels. Depending on your job role
(developer, DBA, or a combination of both), you might optimize at
the level of individual SQL statements, entire applications, a
single database server, or multiple networked database servers.
Sometimes you can be proactive and plan in advance for performance,
while other times you might troubleshoot a configuration or code
issue after a problem occurs. Optimizing CPU and memory usage can
also improve scalability, allowing the database to handle more load
without slowing down.