### 19.5.1 Replication Features and Issues

19.5.1.1 Replication and AUTO_INCREMENT

19.5.1.2 Replication and BLACKHOLE Tables

19.5.1.3 Replication and Character Sets

19.5.1.4 Replication and CHECKSUM TABLE

19.5.1.5 Replication of CREATE SERVER, ALTER SERVER, and DROP SERVER

19.5.1.6 Replication of CREATE ... IF NOT EXISTS Statements

19.5.1.7 Replication of CREATE TABLE ... SELECT Statements

19.5.1.8 Replication of CURRENT_USER()

19.5.1.9 Replication with Differing Table Definitions on Source and Replica

19.5.1.10 Replication and DIRECTORY Table Options

19.5.1.11 Replication of DROP ... IF EXISTS Statements

19.5.1.12 Replication and Floating-Point Values

19.5.1.13 Replication and FLUSH

19.5.1.14 Replication and System Functions

19.5.1.15 Replication and Fractional Seconds Support

19.5.1.16 Replication of Invoked Features

19.5.1.17 Replication of JSON Documents

19.5.1.18 Replication and JavaScript Stored Programs

19.5.1.19 Replication and LIMIT

19.5.1.20 Replication and LOAD DATA

19.5.1.21 Replication and max_allowed_packet

19.5.1.22 Replication and MEMORY Tables

19.5.1.23 Replication of the mysql System Schema

19.5.1.24 Replication and the Query Optimizer

19.5.1.25 Replication and Partitioning

19.5.1.26 Replication and REPAIR TABLE

19.5.1.27 Replication and Reserved Words

19.5.1.28 Replication and Row Searches

19.5.1.29 Replication and Source or Replica Shutdowns

19.5.1.30 Replica Errors During Replication

19.5.1.31 Replication and Server SQL Mode

19.5.1.32 Replication and Temporary Tables

19.5.1.33 Replication Retries and Timeouts

19.5.1.34 Replication and Time Zones

19.5.1.35 Replication and Transaction Inconsistencies

19.5.1.36 Replication and Transactions

19.5.1.37 Replication and Triggers

19.5.1.38 Replication and TRUNCATE TABLE

19.5.1.39 Replication and User Name Length

19.5.1.40 Replication and Variables

19.5.1.41 Replication and Views

The following sections provide information about what is supported and what is not in MySQL replication, and about specific issues and situations that may occur when replicating certain statements.

Statement-based replication depends on compatibility at the SQL level between the source and replica. In other words, successful statement-based replication requires that any SQL features used be supported by both the source and the replica servers. If you use a feature on the source server that is available only in the current version of MySQL, you cannot replicate to a replica that uses an earlier version of MySQL. Such incompatibilities can also occur within a release series as well as between versions.

If you are planning to use statement-based replication between MySQL 9.5 and a previous MySQL release series, it is a good idea to consult the edition of the *MySQL Reference Manual* corresponding to the earlier release series for information regarding the replication characteristics of that series.

With MySQL's statement-based replication, there may be issues with replicating stored routines or triggers. You can avoid these issues by using MySQL's row-based replication instead. For a detailed list of issues, see Section 27.9, “Stored Program Binary Logging”. For more information about row-based logging and row-based replication, see Section 7.4.4.1, “Binary Logging Formats”, and Section 19.2.1, “Replication Formats”.

For additional information specific to replication and `InnoDB`, see Section 17.19, “InnoDB and MySQL Replication”. For information relating to replication with NDB Cluster, see Section 25.7, “NDB Cluster Replication”.
