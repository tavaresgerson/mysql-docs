### 19.5.1 Replication Features and Issues

The following sections provide information about what is supported and what is not in MySQL replication, and about specific issues and situations that may occur when replicating certain statements.

Statement-based replication depends on compatibility at the SQL level between the source and replica. In other words, successful statement-based replication requires that any SQL features used be supported by both the source and the replica servers. If you use a feature on the source server that is available only in the current version of MySQL, you cannot replicate to a replica that uses an earlier version of MySQL. Such incompatibilities can also occur within a release series as well as between versions.

If you are planning to use statement-based replication between MySQL 8.0 and a previous MySQL release series, it is a good idea to consult the edition of the *MySQL Reference Manual* corresponding to the earlier release series for information regarding the replication characteristics of that series.

With MySQL's statement-based replication, there may be issues with replicating stored routines or triggers. You can avoid these issues by using MySQL's row-based replication instead. For a detailed list of issues, see Section 27.7, “Stored Program Binary Logging”. For more information about row-based logging and row-based replication, see Section 7.4.4.1, “Binary Logging Formats”, and Section 19.2.1, “Replication Formats”.

For additional information specific to replication and `InnoDB`, see Section 17.19, “InnoDB and MySQL Replication”. For information relating to replication with NDB Cluster, see Section 25.7, “NDB Cluster Replication”.