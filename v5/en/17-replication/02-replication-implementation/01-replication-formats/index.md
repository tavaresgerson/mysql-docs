### 16.2.1 Replication Formats

[16.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication](replication-sbr-rbr.html)

[16.2.1.2 Usage of Row-Based Logging and Replication](replication-rbr-usage.html)

[16.2.1.3 Determination of Safe and Unsafe Statements in Binary Logging](replication-rbr-safe-unsafe.html)

Replication works because events written to the binary log are read from the source and then processed on the replica. The events are recorded within the binary log in different formats according to the type of event. The different replication formats used correspond to the binary logging format used when the events were recorded in the source's binary log. The correlation between binary logging formats and the terms used during replication are:

* When using statement-based binary logging, the source writes SQL statements to the binary log. Replication of the source to the replica works by executing the SQL statements on the replica. This is called statement-based replication (which can be abbreviated as SBR), which corresponds to the MySQL statement-based binary logging format.

* When using row-based logging, the source writes events to the binary log that indicate how individual table rows are changed. Replication of the source to the replica works by copying the events representing the changes to the table rows to the replica. This is called row-based replication (which can be abbreviated as RBR).

* You can also configure MySQL to use a mix of both statement-based and row-based logging, depending on which is most appropriate for the change to be logged. This is called mixed-format logging. When using mixed-format logging, a statement-based log is used by default. Depending on certain statements, and also the storage engine being used, the log is automatically switched to row-based in particular cases. Replication using the mixed format is referred to as mixed-based replication or mixed-format replication. For more information, see [Section 5.4.4.3, “Mixed Binary Logging Format”](binary-log-mixed.html "5.4.4.3 Mixed Binary Logging Format").

Prior to MySQL 5.7.7, statement-based format was the default. In MySQL 5.7.7 and later, row-based format is the default.

**NDB Cluster.** The default binary logging format in MySQL NDB Cluster 7.5 is `MIXED`. You should note that NDB Cluster Replication always uses row-based replication, and that the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine is incompatible with statement-based replication. See [Section 21.7.2, “General Requirements for NDB Cluster Replication”](mysql-cluster-replication-general.html "21.7.2 General Requirements for NDB Cluster Replication"), for more information.

When using `MIXED` format, the binary logging format is determined in part by the storage engine being used and the statement being executed. For more information on mixed-format logging and the rules governing the support of different logging formats, see [Section 5.4.4.3, “Mixed Binary Logging Format”](binary-log-mixed.html "5.4.4.3 Mixed Binary Logging Format").

The logging format in a running MySQL server is controlled by setting the [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) server system variable. This variable can be set with session or global scope. The rules governing when and how the new setting takes effect are the same as for other MySQL server system variables. Setting the variable for the current session lasts only until the end of that session, and the change is not visible to other sessions. Setting the variable globally takes effect for clients that connect after the change, but not for any current client sessions, including the session where the variable setting was changed. To make the global system variable setting permanent so that it applies across server restarts, you must set it in an option file. For more information, see [Section 13.7.4.1, “SET Syntax for Variable Assignment”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

There are conditions under which you cannot change the binary logging format at runtime or doing so causes replication to fail. See [Section 5.4.4.2, “Setting The Binary Log Format”](binary-log-setting.html "5.4.4.2 Setting The Binary Log Format").

Changing the global [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) value requires privileges sufficient to set global system variables. Changing the session [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) value requires privileges sufficient to set restricted session system variables. See [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

The statement-based and row-based replication formats have different issues and limitations. For a comparison of their relative advantages and disadvantages, see [Section 16.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "16.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

With statement-based replication, you may encounter issues with replicating stored routines or triggers. You can avoid these issues by using row-based replication instead. For more information, see [Section 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").
