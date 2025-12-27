### 16.2.5 How Servers Evaluate Replication Filtering Rules

[16.2.5.1 Evaluation of Database-Level Replication and Binary Logging Options](replication-rules-db-options.html)

[16.2.5.2 Evaluation of Table-Level Replication Options](replication-rules-table-options.html)

[16.2.5.3 Interactions Between Replication Filtering Options](replication-rules-examples.html)

If a replication source server does not write a statement to its binary log, the statement is not replicated. If the server does log the statement, the statement is sent to all replicas and each replica determines whether to execute it or ignore it.

On the source, you can control which databases to log changes for by using the [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) and [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) options to control binary logging. For a description of the rules that servers use in evaluating these options, see [Section 16.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”](replication-rules-db-options.html "16.2.5.1 Evaluation of Database-Level Replication and Binary Logging Options"). You should not use these options to control which databases and tables are replicated. Instead, use filtering on the replica to control the events that are executed on the replica.

On the replica side, decisions about whether to execute or ignore statements received from the source are made according to the `--replicate-*` options that the replica was started with. (See [Section 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").) The filters governed by these options can also be set dynamically using the `CHANGE REPLICATION FILTER` statement. The rules governing such filters are the same whether they are created on startup using `--replicate-*` options or while the replica server is running by `CHANGE REPLICATION FILTER`. Note that replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

In the simplest case, when there are no `--replicate-*` options, the replica executes all statements that it receives from the source. Otherwise, the result depends on the particular options given.

Database-level options ([`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db), [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db)) are checked first; see [Section 16.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”](replication-rules-db-options.html "16.2.5.1 Evaluation of Database-Level Replication and Binary Logging Options"), for a description of this process. If no database-level options are used, option checking proceeds to any table-level options that may be in use (see [Section 16.2.5.2, “Evaluation of Table-Level Replication Options”](replication-rules-table-options.html "16.2.5.2 Evaluation of Table-Level Replication Options"), for a discussion of these). If one or more database-level options are used but none are matched, the statement is not replicated.

For statements affecting databases only (that is, [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement"), [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement"), and [`ALTER DATABASE`](alter-database.html "13.1.1 ALTER DATABASE Statement")), database-level options always take precedence over any [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) options. In other words, for such statements, [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) options are checked if and only if there are no database-level options that apply. This is a change in behavior from previous versions of MySQL, where the statement [`CREATE DATABASE dbx`](create-database.html "13.1.11 CREATE DATABASE Statement") was not replicated if the replica had been started with [`--replicate-do-db=dbx`](replication-options-replica.html#option_mysqld_replicate-do-db) [`--replicate-wild-do-table=db%.t1`](replication-options-replica.html#option_mysqld_replicate-wild-do-table). (Bug #46110)

To make it easier to determine what effect an option set has, it is recommended that you avoid mixing “do” and “ignore” options, or wildcard and nonwildcard options.

If any [`--replicate-rewrite-db`](replication-options-replica.html#option_mysqld_replicate-rewrite-db) options were specified, they are applied before the `--replicate-*` filtering rules are tested.

Note

All replication filtering options follow the same rules for case sensitivity that apply to names of databases and tables elsewhere in the MySQL server, including the effects of the [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) system variable.
