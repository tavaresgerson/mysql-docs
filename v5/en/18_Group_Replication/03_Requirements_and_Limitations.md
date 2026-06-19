## 17.3 Requirements and Limitations

This section lists and explains the requirements and limitations of Group Replication.


### 17.3.1 Group Replication Requirements

Server instances that you want to use for Group Replication must satisfy the following requirements.

#### Infrastructure

* **InnoDB Storage Engine.** Data must be stored in the `InnoDB` transactional storage engine. Transactions are executed optimistically and then, at commit time, are checked for conflicts. If there are conflicts, in order to maintain consistency across the group, some transactions are rolled back. This means that a transactional storage engine is required. Moreover, `InnoDB` provides some additional functionality that enables better management and handling of conflicts when operating together with Group Replication. The use of other storage engines, including the temporary `MEMORY` storage engine, might cause errors in Group Replication. Convert any tables in other storage engines to use `InnoDB` before using the instance with Group Replication. You can prevent the use of other storage engines by setting the `disabled_storage_engines` system variable on group members, for example:

  ```sql
  disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
  ```

* **Primary Keys.** Every table that is to be replicated by the group must have a defined primary key, or primary key equivalent where the equivalent is a non-null unique key. Such keys are required as a unique identifier for every row within a table, enabling the system to determine which transactions conflict by identifying exactly which rows each transaction has modified.

* **IPv4 Network.** The group communication engine used by MySQL Group Replication only supports IPv4. Therefore, Group Replication requires an IPv4 network infrastructure.

* **Network Performance.** MySQL Group Replication is designed to be deployed in a cluster environment where server instances are very close to each other. The performance and stabiity of a group can be impacted by both network latency and network bandwidth. Bi-directional communication must be maintained at all times between all group members. If either inbound or outbound communication is blocked for a server instance (for example, by a firewall, or by connectivity issues), the member cannot function in the group, and the group members (including the member with issues) might not be able to report the correct member status for the affected server instance.

#### Server Instance Configuration

The following options must be configured on server instances that are members of a group.

* **Unique Server Identifier.** Use the `server_id` system variable to configure the server with a unique server ID, as required for all servers in replication topologies. With the default server ID of 0, servers in a replication topology cannot connect to each other. The server ID must be a positive integer between 1 and (232)−1, and it must be different from every other server ID in use by any other server in the replication topology.

* **Binary Log Active.** Set `--log-bin[=log_file_name]`. MySQL Group Replication replicates binary log contents, therefore the binary log needs to be on for it to operate. This option is enabled by default. See Section 5.4.4, “The Binary Log”.

* **Replica Updates Logged.** Set `--log-slave-updates`. Servers need to log binary logs that are applied through the replication applier. Servers in the group need to log all transactions that they receive and apply from the group. This is required because recovery is conducted by relying on binary logs form participants in the group. Therefore, copies of each transaction need to exist on every server, even for those transactions that were not initiated on the server itself.

* **Binary Log Row Format.** Set `--binlog-format=row`. Group Replication relies on row-based replication format to propagate changes consistently among the servers in the group. It relies on row-based infrastructure to be able to extract the necessary information to detect conflicts among transactions that execute concurrently in different servers in the group. See Section 16.2.1, “Replication Formats”.

* **Binary Log Checksums Off.** Set `--binlog-checksum=NONE`. Due to a design limitation of replication event checksums, Group Replication cannot make use of them, and they must be disabled.

* **Global Transaction Identifiers On.** Set `gtid_mode=ON` and `enforce_gtid_consistency=ON`. Group Replication uses global transaction identifiers to track exactly which transactions have been committed on every server instance and thus be able to infer which servers have executed transactions that could conflict with already committed transactions elsewhere. In other words, explicit transaction identifiers are a fundamental part of the framework to be able to determine which transactions may conflict. See Section 16.1.3, “Replication with Global Transaction Identifiers”.

  In addition, if you need to set the value of `gtid_purged`, you must do so while Group Replication is not running.

* **Replication Information Repositories.** Set `master_info_repository=TABLE` and `relay_log_info_repository=TABLE`. The replication applier needs to have the source and replica metadata written to the `mysql.slave_master_info` and `mysql.slave_relay_log_info` system tables. This ensures the Group Replication plugin has consistent recoverability and transactional management of the replication metadata. See Section 16.2.4.2, “Replication Metadata Repositories”.

* **Transaction Write Set Extraction.** Set `--transaction-write-set-extraction=XXHASH64` so that while collecting rows to log them to the binary log, the server collects the write set as well. The write set is based on the primary keys of each row and is a simplified and compact view of a tag that uniquely identifies the row that was changed. This tag is then used for detecting conflicts.

* **Lower Case Table Names.** Set `--lower-case-table-names` to the same value on all group members. A setting of 1 is correct for the use of the `InnoDB` storage engine, which is required for Group Replication. Note that this setting is not the default on all platforms.

* **Multithreaded Appliers.** Group Replication members can be configured as multithreaded replicas, enabling transactions to be applied in parallel. A nonzero value for `slave_parallel_workers` enables the multithreaded applier on the member, and up to 1024 parallel applier threads can be specified. If you do this, the following settings are also required:

  `slave_preserve_commit_order=1` :   This setting is required to ensure that the final commit of parallel transactions is in the same order as the original transactions. Group Replication relies on consistency mechanisms built around the guarantee that all participating members receive and apply committed transactions in the same order.

  `slave_parallel_type=LOGICAL_CLOCK` :   This setting is required with `slave_preserve_commit_order=1`. It specifies the policy used to decide which transactions are allowed to execute in parallel on the replica.

  Setting `slave_parallel_workers=0` disables parallel execution and gives the replica a single applier thread and no coordinator thread. With that setting, the `slave_parallel_type` and `slave_preserve_commit_order` options have no effect and are ignored.


### 17.3.2 Group Replication Limitations

The following known limitations exist for Group Replication. Note that the limitations and issues described for multi-primary mode groups can also apply in single-primary mode clusters during a failover event, while the newly elected primary flushes out its applier queue from the old primary.

Tip

Group Replication is built on GTID based replication, therefore you should also be aware of Section 16.1.3.6, “Restrictions on Replication with GTIDs”.

* **Gap Locks.** Group Replication's certification process for concurrent transactions does not take into account gap locks, as information about gap locks is not available outside of `InnoDB`. See Gap Locks for more information.

  Note

  For a group in multi-primary mode, unless you rely on `REPEATABLE READ` semantics in your applications, we recommend using the `READ COMMITTED` isolation level with Group Replication. InnoDB does not use gap locks in `READ COMMITTED`, which aligns the local conflict detection within InnoDB with the distributed conflict detection performed by Group Replication. For a group in single-primary mode, only the primary accepts writes, so the `READ COMMITTED` isolation level is not important to Group Replication.

* **Table Locks and Named Locks.** The certification process does not take into account table locks (see Section 13.3.5, “LOCK TABLES and UNLOCK TABLES Statements”) or named locks (see `GET_LOCK()`).

* **Replication Event Checksums.** Due to a design limitation of replication event checksums, Group Replication cannot currently make use of them. Therefore set `--binlog-checksum=NONE`.

* **SERIALIZABLE Isolation Level.** `SERIALIZABLE` isolation level is not supported in multi-primary groups by default. Setting a transaction isolation level to `SERIALIZABLE` configures Group Replication to refuse to commit the transaction.

* **Concurrent DDL versus DML Operations.** Concurrent data definition statements and data manipulation statements executing against the same object but on different servers is not supported when using multi-primary mode. During execution of Data Definition Language (DDL) statements on an object, executing concurrent Data Manipulation Language (DML) on the same object but on a different server instance has the risk of conflicting DDL executing on different instances not being detected.

* **Foreign Keys with Cascading Constraints.** Multi-primary mode groups (members all configured with `group_replication_single_primary_mode=OFF`) do not support tables with multi-level foreign key dependencies, specifically tables that have defined `CASCADING` foreign key constraints. This is because foreign key constraints that result in cascading operations executed by a multi-primary mode group can result in undetected conflicts and lead to inconsistent data across the members of the group. Therefore we recommend setting `group_replication_enforce_update_everywhere_checks=ON` on server instances used in multi-primary mode groups to avoid undetected conflicts.

  In single-primary mode this is not a problem as it does not allow concurrent writes to multiple members of the group and thus there is no risk of undetected conflicts.

* **MySQL Enterprise Audit and MySQL Enterprise Firewall.** Prior to version 5.7.21 MySQL Enterprise Audit and MySQL Enterprise Firewall use `MyISAM` tables in the `mysql` system database. Group Replication does not support `MyISAM` tables.

* **Multi-primary Mode Deadlock.** When a group is operating in multi-primary mode, `SELECT .. FOR UPDATE` statements can result in a deadlock. This is because the lock is not shared across the members of the group, therefore the expectation for such a statement might not be reached.

* **Replication Filters.** Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

#### Limit on Group Size

The maximum number of MySQL servers that can be members of a single replication group is 9. If further members attempt to join the group, their request is refused. This limit has been identified from testing and benchmarking as a safe boundary where the group performs reliably on a stable local area network.

#### Limits on Transaction Size

If an individual transaction results in message contents which are large enough that the message cannot be copied between group members over the network within a 5-second window, members can be suspected of having failed, and then expelled, just because they are busy processing the transaction. Large transactions can also cause the system to slow due to problems with memory allocation. To avoid these issues use the following mitigations:

* Where possible, try and limit the size of your transactions. For example, split up files used with `LOAD DATA` into smaller chunks.

* Use the system variable `group_replication_transaction_size_limit` to specify the maximum transaction size that the group accepts. In releases up to and including MySQL 5.7.37, this system variable defaults to zero, but from MySQL 5.7.38, and in MySQL 8.0, it defaults to a maximum transaction size of 150000000 bytes (approximately 143 MB). Transactions above this limit are rolled back and are not sent to Group Replication's Group Communication System (GCS) for distribution to the group. Adjust the value of this variable depending on the maximum message size that you need the group to tolerate, bearing in mind that the time taken to process a transaction is proportional to its size.

  Note

  When you upgrade from MySQL 5.7.37 or earlier to MySQL 5.7.38 or later, if your Group Replication servers previously accepted transactions larger than the new default limit, and you were allowing `group_replication_transaction_size_limit` to default to the old zero limit, those transactions will start to fail after the upgrade to the new default. You must either specify an appropriate size limit that allows the maximum message size you need the group to tolerate (which is the recommended solution), or specify a zero setting to restore the previous behavior.

* Use the system variable `group_replication_compression_threshold` to specify a message size above which compression is applied. This system variable defaults to 1000000 bytes (1 MB), so large messages are automatically compressed. Compression is carried out by Group Replication's Group Communication System (GCS) when it receives a message that was permitted by the `group_replication_transaction_size_limit` setting but exceeds the `group_replication_compression_threshold` setting. If you set the system variable value to zero, compression is deactivated. For more information, see Section 17.9.7.2, “Message Compression”.

If you have deactivated message compression and do not specify a maximum transaction size, the upper size limit for a message that can be handled by the applier thread on a member of a replication group is the value of the member's `slave_max_allowed_packet` system variable, which has a default and maximum value of 1073741824 bytes (1 GB). A message that exceeds this limit fails when the receiving member attempts to handle it. The upper size limit for a message that a group member can originate and attempt to transmit to the group is 4294967295 bytes (approximately 4 GB). This is a hard limit on the packet size that is accepted by the group communication engine for Group Replication (XCom, a Paxos variant), which receives messages after GCS has handled them. A message that exceeds this limit fails when the originating member attempts to broadcast it.
