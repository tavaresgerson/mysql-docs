# Chapter 10 Optimization

**Table of Contents**

[10.1 Optimization Overview](optimize-overview.html)

[10.2 Optimizing SQL Statements](statement-optimization.html)
:   [10.2.1 Optimizing SELECT Statements](select-optimization.html)

    [10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions](subquery-optimization.html)

    [10.2.3 Optimizing INFORMATION\_SCHEMA Queries](information-schema-optimization.html)

    [10.2.4 Optimizing Performance Schema Queries](performance-schema-optimization.html)

    [10.2.5 Optimizing Data Change Statements](data-change-optimization.html)

    [10.2.6 Optimizing Database Privileges](permission-optimization.html)

    [10.2.7 Other Optimization Tips](miscellaneous-optimization-tips.html)

[10.3 Optimization and Indexes](optimization-indexes.html)
:   [10.3.1 How MySQL Uses Indexes](mysql-indexes.html)

    [10.3.2 Primary Key Optimization](primary-key-optimization.html)

    [10.3.3 SPATIAL Index Optimization](spatial-index-optimization.html)

    [10.3.4 Foreign Key Optimization](foreign-key-optimization.html)

    [10.3.5 Column Indexes](column-indexes.html)

    [10.3.6 Multiple-Column Indexes](multiple-column-indexes.html)

    [10.3.7 Verifying Index Usage](verifying-index-usage.html)

    [10.3.8 InnoDB and MyISAM Index Statistics Collection](index-statistics.html)

    [10.3.9 Comparison of B-Tree and Hash Indexes](index-btree-hash.html)

    [10.3.10 Use of Index Extensions](index-extensions.html)

    [10.3.11 Optimizer Use of Generated Column Indexes](generated-column-index-optimizations.html)

    [10.3.12 Invisible Indexes](invisible-indexes.html)

    [10.3.13 Descending Indexes](descending-indexes.html)

    [10.3.14 Indexed Lookups from TIMESTAMP Columns](timestamp-lookups.html)

[10.4 Optimizing Database Structure](optimizing-database-structure.html)
:   [10.4.1 Optimizing Data Size](data-size.html)

    [10.4.2 Optimizing MySQL Data Types](optimize-data-types.html)

    [10.4.3 Optimizing for Many Tables](optimize-multi-tables.html)

    [10.4.4 Internal Temporary Table Use in MySQL](internal-temporary-tables.html)

    [10.4.5 Limits on Number of Databases and Tables](database-count-limit.html)

    [10.4.6 Limits on Table Size](table-size-limit.html)

    [10.4.7 Limits on Table Column Count and Row Size](column-count-limit.html)

[10.5 Optimizing for InnoDB Tables](optimizing-innodb.html)
:   [10.5.1 Optimizing Storage Layout for InnoDB Tables](optimizing-innodb-storage-layout.html)

    [10.5.2 Optimizing InnoDB Transaction Management](optimizing-innodb-transaction-management.html)

    [10.5.3 Optimizing InnoDB Read-Only Transactions](innodb-performance-ro-txn.html)

    [10.5.4 Optimizing InnoDB Redo Logging](optimizing-innodb-logging.html)

    [10.5.5 Bulk Data Loading for InnoDB Tables](optimizing-innodb-bulk-data-loading.html)

    [10.5.6 Optimizing InnoDB Queries](optimizing-innodb-queries.html)

    [10.5.7 Optimizing InnoDB DDL Operations](optimizing-innodb-ddl-operations.html)

    [10.5.8 Optimizing InnoDB Disk I/O](optimizing-innodb-diskio.html)

    [10.5.9 Optimizing InnoDB Configuration Variables](optimizing-innodb-configuration-variables.html)

    [10.5.10 Optimizing InnoDB for Systems with Many Tables](optimizing-innodb-many-tables.html)

[10.6 Optimizing for MyISAM Tables](optimizing-myisam.html)
:   [10.6.1 Optimizing MyISAM Queries](optimizing-queries-myisam.html)

    [10.6.2 Bulk Data Loading for MyISAM Tables](optimizing-myisam-bulk-data-loading.html)

    [10.6.3 Optimizing REPAIR TABLE Statements](repair-table-optimization.html)

[10.7 Optimizing for MEMORY Tables](optimizing-memory-tables.html)

[10.8 Understanding the Query Execution Plan](execution-plan-information.html)
:   [10.8.1 Optimizing Queries with EXPLAIN](using-explain.html)

    [10.8.2 EXPLAIN Output Format](explain-output.html)

    [10.8.3 Extended EXPLAIN Output Format](explain-extended.html)

    [10.8.4 Obtaining Execution Plan Information for a Named Connection](explain-for-connection.html)

    [10.8.5 Estimating Query Performance](estimating-performance.html)

[10.9 Controlling the Query Optimizer](controlling-optimizer.html)
:   [10.9.1 Controlling Query Plan Evaluation](controlling-query-plan-evaluation.html)

    [10.9.2 Switchable Optimizations](switchable-optimizations.html)

    [10.9.3 Optimizer Hints](optimizer-hints.html)

    [10.9.4 Index Hints](index-hints.html)

    [10.9.5 The Optimizer Cost Model](cost-model.html)

    [10.9.6 Optimizer Statistics](optimizer-statistics.html)

[10.10 Buffering and Caching](buffering-caching.html)
:   [10.10.1 InnoDB Buffer Pool Optimization](innodb-buffer-pool-optimization.html)

    [10.10.2 The MyISAM Key Cache](myisam-key-cache.html)

    [10.10.3 Caching of Prepared Statements and Stored Programs](statement-caching.html)

[10.11 Optimizing Locking Operations](locking-issues.html)
:   [10.11.1 Internal Locking Methods](internal-locking.html)

    [10.11.2 Table Locking Issues](table-locking.html)

    [10.11.3 Concurrent Inserts](concurrent-inserts.html)

    [10.11.4 Metadata Locking](metadata-locking.html)

    [10.11.5 External Locking](external-locking.html)

[10.12 Optimizing the MySQL Server](optimizing-server.html)
:   [10.12.1 Optimizing Disk I/O](disk-issues.html)

    [10.12.2 Using Symbolic Links](symbolic-links.html)

    [10.12.3 Optimizing Memory Use](optimizing-memory.html)

[10.13 Measuring Performance (Benchmarking)](optimize-benchmarking.html)
:   [10.13.1 Measuring the Speed of Expressions and Functions](select-benchmarking.html)

    [10.13.2 Using Your Own Benchmarks](custom-benchmarks.html)

    [10.13.3 Measuring Performance with performance\_schema](monitoring-performance-schema.html)

[10.14 Examining Server Thread (Process) Information](thread-information.html)
:   [10.14.1 Accessing the Process List](processlist-access.html)

    [10.14.2 Thread Command Values](thread-commands.html)

    [10.14.3 General Thread States](general-thread-states.html)

    [10.14.4 Replication Source Thread States](source-thread-states.html)

    [10.14.5 Replication I/O (Receiver) Thread States](replica-io-thread-states.html)

    [10.14.6 Replication SQL Thread States](replica-sql-thread-states.html)

    [10.14.7 Replication Connection Thread States](replica-connection-thread-states.html)

    [10.14.8 NDB Cluster Thread States](mysql-cluster-thread-states.html)

    [10.14.9 Event Scheduler Thread States](event-scheduler-thread-states.html)

[10.15 Tracing the Optimizer](optimizer-tracing.html)
:   [10.15.1 Typical Usage](optimizer-tracing-typical-usage.html)

    [10.15.2 System Variables Controlling Tracing](system-variables-controlling-tracing.html)

    [10.15.3 Traceable Statements](traceable-statements.html)

    [10.15.4 Tuning Trace Purging](tuning-trace-purging.html)

    [10.15.5 Tracing Memory Usage](tracing-memory-usage.html)

    [10.15.6 Privilege Checking](privilege-checking.html)

    [10.15.7 Interaction with the --debug Option](interaction-with-debug-option.html)

    [10.15.8 The optimizer\_trace System Variable](optimizer-trace-system-variable.html)

    [10.15.9 The end\_markers\_in\_json System Variable](end-markers-in-json-system-variable.html)

    [10.15.10 Selecting Optimizer Features to Trace](optimizer-features-to-trace.html)

    [10.15.11 Trace General Structure](trace-general-structure.html)

    [10.15.12 Example](tracing-example.html)

    [10.15.13 Displaying Traces in Other Applications](displaying-traces.html)

    [10.15.14 Preventing the Use of Optimizer Trace](preventing-use-of-optimizer-trace.html)

    [10.15.15 Testing Optimizer Trace](optimizer-trace-testing.html)

    [10.15.16 Optimizer Trace Implementation](optimizer-trace-implementation.html)

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