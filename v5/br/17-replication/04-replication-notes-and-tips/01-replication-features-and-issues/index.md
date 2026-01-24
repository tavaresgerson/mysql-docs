### 16.4.1 Replication Features and Issues

[16.4.1.1 Replication and AUTO_INCREMENT](replication-features-auto-increment.html)

[16.4.1.2 Replication and BLACKHOLE Tables](replication-features-blackhole.html)

[16.4.1.3 Replication and Character Sets](replication-features-charset.html)

[16.4.1.4 Replication and CHECKSUM TABLE](replication-features-checksum-table.html)

[16.4.1.5 Replication of CREATE ... IF NOT EXISTS Statements](replication-features-create-if-not-exists.html)

[16.4.1.6 Replication of CREATE TABLE ... SELECT Statements](replication-features-create-select.html)

[16.4.1.7 Replication of CREATE SERVER, ALTER SERVER, and DROP SERVER](replication-features-create-alter-drop-server.html)

[16.4.1.8 Replication of CURRENT_USER()](replication-features-current-user.html)

[16.4.1.9 Replication of DROP ... IF EXISTS Statements](replication-features-drop-if-exists.html)

[16.4.1.10 Replication with Differing Table Definitions on Source and Replica](replication-features-differing-tables.html)

[16.4.1.11 Replication and DIRECTORY Table Options](replication-features-directory.html)

[16.4.1.12 Replication and Floating-Point Values](replication-features-floatvalues.html)

[16.4.1.13 Replication and Fractional Seconds Support](replication-features-fractional-seconds.html)

[16.4.1.14 Replication and FLUSH](replication-features-flush.html)

[16.4.1.15 Replication and System Functions](replication-features-functions.html)

[16.4.1.16 Replication of Invoked Features](replication-features-invoked.html)

[16.4.1.17 Replication and LIMIT](replication-features-limit.html)

[16.4.1.18 Replication and LOAD DATA](replication-features-load-data.html)

[16.4.1.19 Replication and max_allowed_packet](replication-features-max-allowed-packet.html)

[16.4.1.20 Replication and MEMORY Tables](replication-features-memory.html)

[16.4.1.21 Replication of the mysql System Database](replication-features-mysqldb.html)

[16.4.1.22 Replication and the Query Optimizer](replication-features-optimizer.html)

[16.4.1.23 Replication and Partitioning](replication-features-partitioning.html)

[16.4.1.24 Replication and REPAIR TABLE](replication-features-repair-table.html)

[16.4.1.25 Replication and Reserved Words](replication-features-reserved-words.html)

[16.4.1.26 Replication and Source or Replica Shutdowns](replication-features-shutdowns.html)

[16.4.1.27 Replica Errors During Replication](replication-features-errors.html)

[16.4.1.28 Replication and Server SQL Mode](replication-features-sql-mode.html)

[16.4.1.29 Replication and Temporary Tables](replication-features-temptables.html)

[16.4.1.30 Replication Retries and Timeouts](replication-features-timeout.html)

[16.4.1.31 Replication and Time Zones](replication-features-timezone.html)

[16.4.1.32 Replication and Transaction Inconsistencies](replication-features-transaction-inconsistencies.html)

[16.4.1.33 Replication and Transactions](replication-features-transactions.html)

[16.4.1.34 Replication and Triggers](replication-features-triggers.html)

[16.4.1.35 Replication and TRUNCATE TABLE](replication-features-truncate.html)

[16.4.1.36 Replication and User Name Length](replication-features-user-names.html)

[16.4.1.37 Replication and Variables](replication-features-variables.html)

[16.4.1.38 Replication and Views](replication-features-views.html)

The following sections provide information about what is supported and what is not in MySQL replication, and about specific issues and situations that may occur when replicating certain statements.

Statement-based replication depends on compatibility at the SQL level between the source and replica. In other words, successful statement-based replication requires that any SQL features used be supported by both the source and the replica servers. If you use a feature on the source server that is available only in the current version of MySQL, you cannot replicate to a replica that uses an earlier version of MySQL. Such incompatibilities can also occur within a release series as well as between versions.

If you are planning to use statement-based replication between MySQL 5.7 and a previous MySQL release series, it is a good idea to consult the edition of the *MySQL Reference Manual* corresponding to the earlier release series for information regarding the replication characteristics of that series.

With MySQL's statement-based replication, there may be issues with replicating stored routines or triggers. You can avoid these issues by using MySQL's row-based replication instead. For a detailed list of issues, see [Section 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging"). For more information about row-based logging and row-based replication, see [Section 5.4.4.1, “Binary Logging Formats”](binary-log-formats.html "5.4.4.1 Binary Logging Formats"), and [Section 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

For additional information specific to replication and `InnoDB`, see [Section 14.20, “InnoDB and MySQL Replication”](innodb-and-mysql-replication.html "14.20 InnoDB and MySQL Replication"). For information relating to replication with NDB Cluster, see [Section 21.7, “NDB Cluster Replication”](mysql-cluster-replication.html "21.7 NDB Cluster Replication").
