### 19.5.1 Replication Features and Issues

[19.5.1.1 Replication and AUTO\_INCREMENT](replication-features-auto-increment.html)

[19.5.1.2 Replication and BLACKHOLE Tables](replication-features-blackhole.html)

[19.5.1.3 Replication and Character Sets](replication-features-charset.html)

[19.5.1.4 Replication and CHECKSUM TABLE](replication-features-checksum-table.html)

[19.5.1.5 Replication of CREATE SERVER, ALTER SERVER, and DROP SERVER](replication-features-create-alter-drop-server.html)

[19.5.1.6 Replication of CREATE ... IF NOT EXISTS Statements](replication-features-create-if-not-exists.html)

[19.5.1.7 Replication of CREATE TABLE ... SELECT Statements](replication-features-create-select.html)

[19.5.1.8 Replication of CURRENT\_USER()](replication-features-current-user.html)

[19.5.1.9 Replication with Differing Table Definitions on Source and Replica](replication-features-differing-tables.html)

[19.5.1.10 Replication and DIRECTORY Table Options](replication-features-directory.html)

[19.5.1.11 Replication of DROP ... IF EXISTS Statements](replication-features-drop-if-exists.html)

[19.5.1.12 Replication and Floating-Point Values](replication-features-floatvalues.html)

[19.5.1.13 Replication and FLUSH](replication-features-flush.html)

[19.5.1.14 Replication and System Functions](replication-features-functions.html)

[19.5.1.15 Replication and Fractional Seconds Support](replication-features-fractional-seconds.html)

[19.5.1.16 Replication of Invoked Features](replication-features-invoked.html)

[19.5.1.17 Replication of JSON Documents](replication-features-json.html)

[19.5.1.18 Replication and LIMIT](replication-features-limit.html)

[19.5.1.19 Replication and LOAD DATA](replication-features-load-data.html)

[19.5.1.20 Replication and max\_allowed\_packet](replication-features-max-allowed-packet.html)

[19.5.1.21 Replication and MEMORY Tables](replication-features-memory.html)

[19.5.1.22 Replication of the mysql System Schema](replication-features-mysqldb.html)

[19.5.1.23 Replication and the Query Optimizer](replication-features-optimizer.html)

[19.5.1.24 Replication and Partitioning](replication-features-partitioning.html)

[19.5.1.25 Replication and REPAIR TABLE](replication-features-repair-table.html)

[19.5.1.26 Replication and Reserved Words](replication-features-reserved-words.html)

[19.5.1.27 Replication and Row Searches](replication-features-row-searches.html)

[19.5.1.28 Replication and Source or Replica Shutdowns](replication-features-shutdowns.html)

[19.5.1.29 Replica Errors During Replication](replication-features-errors.html)

[19.5.1.30 Replication and Server SQL Mode](replication-features-sql-mode.html)

[19.5.1.31 Replication and Temporary Tables](replication-features-temptables.html)

[19.5.1.32 Replication Retries and Timeouts](replication-features-timeout.html)

[19.5.1.33 Replication and Time Zones](replication-features-timezone.html)

[19.5.1.34 Replication and Transaction Inconsistencies](replication-features-transaction-inconsistencies.html)

[19.5.1.35 Replication and Transactions](replication-features-transactions.html)

[19.5.1.36 Replication and Triggers](replication-features-triggers.html)

[19.5.1.37 Replication and TRUNCATE TABLE](replication-features-truncate.html)

[19.5.1.38 Replication and User Name Length](replication-features-user-names.html)

[19.5.1.39 Replication and Variables](replication-features-variables.html)

[19.5.1.40 Replication and Views](replication-features-views.html)

The following sections provide information about what is supported
and what is not in MySQL replication, and about specific issues
and situations that may occur when replicating certain statements.

Statement-based replication depends on compatibility at the SQL
level between the source and replica. In other words, successful
statement-based replication requires that any SQL features used be
supported by both the source and the replica servers. If you use a
feature on the source server that is available only in the current
version of MySQL, you cannot replicate to a replica that uses an
earlier version of MySQL. Such incompatibilities can also occur
within a release series as well as between versions.

If you are planning to use statement-based replication between
MySQL 8.0 and a previous MySQL release series, it is
a good idea to consult the edition of the *MySQL
Reference Manual* corresponding to the earlier release
series for information regarding the replication characteristics
of that series.

With MySQL's statement-based replication, there may be issues with
replicating stored routines or triggers. You can avoid these
issues by using MySQL's row-based replication instead. For a
detailed list of issues, see
[Section 27.7, “Stored Program Binary Logging”](stored-programs-logging.html "27.7 Stored Program Binary Logging"). For more information
about row-based logging and row-based replication, see
[Section 7.4.4.1, “Binary Logging Formats”](binary-log-formats.html "7.4.4.1 Binary Logging Formats"), and
[Section 19.2.1, “Replication Formats”](replication-formats.html "19.2.1 Replication Formats").

For additional information specific to replication and
`InnoDB`, see
[Section 17.19, “InnoDB and MySQL Replication”](innodb-and-mysql-replication.html "17.19 InnoDB and MySQL Replication"). For information
relating to replication with NDB Cluster, see
[Section 25.7, “NDB Cluster Replication”](mysql-cluster-replication.html "25.7 NDB Cluster Replication").