### 17.3.2 Group Replication Limitations

The following known limitations exist for Group Replication. Note that the limitations and issues described for multi-primary mode groups can also apply in single-primary mode clusters during a failover event, while the newly elected primary flushes out its applier queue from the old primary.

Tip

Group Replication is built on GTID based replication, therefore you should also be aware of [Section 16.1.3.6, “Restrictions on Replication with GTIDs”](replication-gtids-restrictions.html "16.1.3.6 Restrictions on Replication with GTIDs").

* **Gap Locks.** Group Replication's certification process for concurrent transactions does not take into account [gap locks](glossary.html#glos_gap_lock "gap lock"), as information about gap locks is not available outside of [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). See [Gap Locks](innodb-locking.html#innodb-gap-locks "Gap Locks") for more information.

  Note

  For a group in multi-primary mode, unless you rely on [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read) semantics in your applications, we recommend using the [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed) isolation level with Group Replication. InnoDB does not use gap locks in [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed), which aligns the local conflict detection within InnoDB with the distributed conflict detection performed by Group Replication. For a group in single-primary mode, only the primary accepts writes, so the [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed) isolation level is not important to Group Replication.

* **Table Locks and Named Locks.** The certification process does not take into account table locks (see [Section 13.3.5, “LOCK TABLES and UNLOCK TABLES Statements”](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements")) or named locks (see [`GET_LOCK()`](locking-functions.html#function_get-lock)).

* **Replication Event Checksums.** Due to a design limitation of replication event checksums, Group Replication cannot currently make use of them. Therefore set [`--binlog-checksum=NONE`](replication-options-binary-log.html#sysvar_binlog_checksum).

* **SERIALIZABLE Isolation Level.** [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable) isolation level is not supported in multi-primary groups by default. Setting a transaction isolation level to `SERIALIZABLE` configures Group Replication to refuse to commit the transaction.

* **Concurrent DDL versus DML Operations.** Concurrent data definition statements and data manipulation statements executing against the same object but on different servers is not supported when using multi-primary mode. During execution of Data Definition Language (DDL) statements on an object, executing concurrent Data Manipulation Language (DML) on the same object but on a different server instance has the risk of conflicting DDL executing on different instances not being detected.

* **Foreign Keys with Cascading Constraints.** Multi-primary mode groups (members all configured with [`group_replication_single_primary_mode=OFF`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode)) do not support tables with multi-level foreign key dependencies, specifically tables that have defined `CASCADING` [foreign key constraints](glossary.html#glos_foreign_key_constraint "FOREIGN KEY constraint"). This is because foreign key constraints that result in cascading operations executed by a multi-primary mode group can result in undetected conflicts and lead to inconsistent data across the members of the group. Therefore we recommend setting [`group_replication_enforce_update_everywhere_checks=ON`](group-replication-system-variables.html#sysvar_group_replication_enforce_update_everywhere_checks) on server instances used in multi-primary mode groups to avoid undetected conflicts.

  In single-primary mode this is not a problem as it does not allow concurrent writes to multiple members of the group and thus there is no risk of undetected conflicts.

* **MySQL Enterprise Audit and MySQL Enterprise Firewall.** Prior to version 5.7.21 MySQL Enterprise Audit and MySQL Enterprise Firewall use `MyISAM` tables in the `mysql` system database. Group Replication does not support `MyISAM` tables.

* **Multi-primary Mode Deadlock.** When a group is operating in multi-primary mode, `SELECT .. FOR UPDATE` statements can result in a deadlock. This is because the lock is not shared across the members of the group, therefore the expectation for such a statement might not be reached.

* **Replication Filters.** Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

#### Limit on Group Size

The maximum number of MySQL servers that can be members of a single replication group is 9. If further members attempt to join the group, their request is refused. This limit has been identified from testing and benchmarking as a safe boundary where the group performs reliably on a stable local area network.

#### Limits on Transaction Size

If an individual transaction results in message contents which are large enough that the message cannot be copied between group members over the network within a 5-second window, members can be suspected of having failed, and then expelled, just because they are busy processing the transaction. Large transactions can also cause the system to slow due to problems with memory allocation. To avoid these issues use the following mitigations:

* Where possible, try and limit the size of your transactions. For example, split up files used with `LOAD DATA` into smaller chunks.

* Use the system variable [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit) to specify the maximum transaction size that the group accepts. In releases up to and including MySQL 5.7.37, this system variable defaults to zero, but from MySQL 5.7.38, and in MySQL 8.0, it defaults to a maximum transaction size of 150000000 bytes (approximately 143 MB). Transactions above this limit are rolled back and are not sent to Group Replication's Group Communication System (GCS) for distribution to the group. Adjust the value of this variable depending on the maximum message size that you need the group to tolerate, bearing in mind that the time taken to process a transaction is proportional to its size.

  Note

  When you upgrade from MySQL 5.7.37 or earlier to MySQL 5.7.38 or later, if your Group Replication servers previously accepted transactions larger than the new default limit, and you were allowing [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit) to default to the old zero limit, those transactions will start to fail after the upgrade to the new default. You must either specify an appropriate size limit that allows the maximum message size you need the group to tolerate (which is the recommended solution), or specify a zero setting to restore the previous behavior.

* Use the system variable [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold) to specify a message size above which compression is applied. This system variable defaults to 1000000 bytes (1 MB), so large messages are automatically compressed. Compression is carried out by Group Replication's Group Communication System (GCS) when it receives a message that was permitted by the [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit) setting but exceeds the [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold) setting. If you set the system variable value to zero, compression is deactivated. For more information, see [Section 17.9.7.2, “Message Compression”](group-replication-message-compression.html "17.9.7.2 Message Compression").

If you have deactivated message compression and do not specify a maximum transaction size, the upper size limit for a message that can be handled by the applier thread on a member of a replication group is the value of the member's [`slave_max_allowed_packet`](replication-options-replica.html#sysvar_slave_max_allowed_packet) system variable, which has a default and maximum value of 1073741824 bytes (1 GB). A message that exceeds this limit fails when the receiving member attempts to handle it. The upper size limit for a message that a group member can originate and attempt to transmit to the group is 4294967295 bytes (approximately 4 GB). This is a hard limit on the packet size that is accepted by the group communication engine for Group Replication (XCom, a Paxos variant), which receives messages after GCS has handled them. A message that exceeds this limit fails when the originating member attempts to broadcast it.
