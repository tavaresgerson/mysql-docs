#### 16.2.5.2 Evaluation of Table-Level Replication Options

The replica checks for and evaluates table options only if either of the following two conditions is true:

* No matching database options were found.
* One or more database options were found, and were evaluated to arrive at an “execute” condition according to the rules described in the previous section (see [Section 16.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”](replication-rules-db-options.html "16.2.5.1 Evaluation of Database-Level Replication and Binary Logging Options")).

First, as a preliminary condition, the replica checks whether statement-based replication is enabled. If so, and the statement occurs within a stored function, the replica executes the statement and exits. If row-based replication is enabled, the replica does not know whether a statement occurred within a stored function on the source, so this condition does not apply.

Note

For statement-based replication, replication events represent statements (all changes making up a given event are associated with a single SQL statement); for row-based replication, each event represents a change in a single table row (thus a single statement such as `UPDATE mytable SET mycol = 1` may yield many row-based events). When viewed in terms of events, the process of checking table options is the same for both row-based and statement-based replication.

Having reached this point, if there are no table options, the replica simply executes all events. If there are any [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table) or [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) options, the event must match one of these if it is to be executed; otherwise, it is ignored. If there are any [`--replicate-ignore-table`](replication-options-replica.html#option_mysqld_replicate-ignore-table) or [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table) options, all events are executed except those that match any of these options.

Important

Table-level replication filters are only applied to tables that are explicitly mentioned and operated on in the query. They do not apply to tables that are implicitly updated by the query. For example, a [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement, which updates the `mysql.user` system table but does not mention that table, is not affected by a filter that specifies `mysql.%` as the wildcard pattern.

The following steps describe this evaluation in more detail. The starting point is the end of the evaluation of the database-level options, as described in [Section 16.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”](replication-rules-db-options.html "16.2.5.1 Evaluation of Database-Level Replication and Binary Logging Options").

1. Are there any table replication options?

   * **Yes.** Continue to step 2.

   * **No.** Execute the update and exit.

2. Which logging format is used?

   * **STATEMENT.** Carry out the remaining steps for each statement that performs an update.

   * **ROW.** Carry out the remaining steps for each update of a table row.

3. Are there any [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table) options?

   * **Yes.** Does the table match any of them?

     + **Yes.** Execute the update and exit.

     + **No.** Continue to step 4.

   * **No.** Continue to step 4.

4. Are there any [`--replicate-ignore-table`](replication-options-replica.html#option_mysqld_replicate-ignore-table) options?

   * **Yes.** Does the table match any of them?

     + **Yes.** Ignore the update and exit.

     + **No.** Continue to step 5.

   * **No.** Continue to step 5.

5. Are there any [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) options?

   * **Yes.** Does the table match any of them?

     + **Yes.** Execute the update and exit.

     + **No.** Continue to step 6.

   * **No.** Continue to step 6.

6. Are there any [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table) options?

   * **Yes.** Does the table match any of them?

     + **Yes.** Ignore the update and exit.

     + **No.** Continue to step 7.

   * **No.** Continue to step 7.

7. Is there another table to be tested?

   * **Yes.** Go back to step 3.

   * **No.** Continue to step 8.

8. Are there any [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table) or [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) options?

   * **Yes.** Ignore the update and exit.

   * **No.** Execute the update and exit.

Note

Statement-based replication stops if a single SQL statement operates on both a table that is included by a [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table) or [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) option, and another table that is ignored by a [`--replicate-ignore-table`](replication-options-replica.html#option_mysqld_replicate-ignore-table) or [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table) option. The replica must either execute or ignore the complete statement (which forms a replication event), and it cannot logically do this. This also applies to row-based replication for DDL statements, because DDL statements are always logged as statements, without regard to the logging format in effect. The only type of statement that can update both an included and an ignored table and still be replicated successfully is a DML statement that has been logged with [`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format).
