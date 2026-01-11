### 20.3.1 Group Replication Requirements

* Infrastructure
* Server Instance Configuration

Server instances that you want to use for Group Replication must satisfy the following requirements.

#### Infrastructure

* **InnoDB Storage Engine.** Data must be stored in the `InnoDB` transactional storage engine. Transactions are executed optimistically and then, at commit time, are checked for conflicts. If there are conflicts, in order to maintain consistency across the group, some transactions are rolled back. This means that a transactional storage engine is required. Moreover, `InnoDB` provides some additional functionality that enables better management and handling of conflicts when operating together with Group Replication. The use of other storage engines, including the temporary `MEMORY` storage engine, might cause errors in Group Replication. Convert any tables in other storage engines to use `InnoDB` before using the instance with Group Replication. You can prevent the use of other storage engines by setting the `disabled_storage_engines` system variable on group members, for example:

  ```
  disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
  ```

* **Primary Keys.** Every table that is to be replicated by the group must have a defined primary key, or primary key equivalent where the equivalent is a non-null unique key. Such keys are required as a unique identifier for every row within a table, enabling the system to determine which transactions conflict by identifying exactly which rows each transaction has modified. Group Replication has its own built-in set of checks for primary keys or primary key equivalents, and does not use the checks carried out by the `sql_require_primary_key` system variable. You may set `sql_require_primary_key=ON` for a server instance where Group Replication is running, and you may set the `REQUIRE_TABLE_PRIMARY_KEY_CHECK` option of the `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` statement to `ON` for a Group Replication channel. However, be aware that you might find some transactions that are permitted under Group Replication's built-in checks are not permitted under the checks carried out when you set `sql_require_primary_key=ON` or `REQUIRE_TABLE_PRIMARY_KEY_CHECK=ON`.

* **Network Performance.** MySQL Group Replication is designed to be deployed in a cluster environment where server instances are very close to each other. The performance and stability of a group can be impacted by both network latency and network bandwidth. Bi-directional communication must be maintained at all times between all group members. If either inbound or outbound communication is blocked for a server instance (for example, by a firewall, or by connectivity issues), the member cannot function in the group, and the group members (including the member with issues) might not be able to report the correct member status for the affected server instance.

  From MySQL 8.0.14, you can use an IPv4 or IPv6 network infrastructure, or a mix of the two, for TCP communication between remote Group Replication servers. There is also nothing preventing Group Replication from operating over a virtual private network (VPN).

  Also from MySQL 8.0.14, where Group Replication server instances are co-located and share a local group communication engine (XCom) instance, a dedicated input channel with lower overhead is used for communication where possible instead of the TCP socket. For certain Group Replication tasks that require communication between remote XCom instances, such as joining a group, the TCP network is still used, so network performance influences the group's performance.

#### Server Instance Configuration

The following options must be configured as shown on server instances that are members of a group.

* **Unique Server Identifier.** Use the `server_id` system variable to configure the server with a unique server ID, as required for all servers in replication topologies. The server ID must be a positive integer between 1 and (232)−1, and it must be different from every other server ID in use by any other server in the replication topology.

* **Binary Log Active.** Set `--log-bin[=log_file_name]`. From MySQL 8.0, binary logging is enabled by default, and you do not need to specify this option unless you want to change the name of the binary log files. Group Replication replicates the binary log's contents, therefore the binary log needs to be on for it to operate. See Section 7.4.4, “The Binary Log”.

* **Replica Updates Logged.** Set `log_replica_updates=ON` (from MySQL 8.0.26) or `log_slave_updates=ON` (before MySQL 8.0.26). From MySQL 8.0, this setting is the default, so you do not need to specify it. Group members need to log transactions that are received from their donors at joining time and applied through the replication applier, and to log all transactions that they receive and apply from the group. This enables Group Replication to carry out distributed recovery by state transfer from an existing group member's binary log.

* **Binary Log Row Format.** Set `binlog_format=row`. This setting is the default, so you do not need to specify it. Group Replication relies on the row-based replication format to propagate changes consistently among the servers in the group, and extract the necessary information to detect conflicts among transactions that execute concurrently in different servers in the group. From MySQL 8.0.19, the `REQUIRE_ROW_FORMAT` setting is automatically added to Group Replication's channels to enforce the use of row-based replication when the transactions are applied. See Section 19.2.1, “Replication Formats” and Section 19.3.3, “Replication Privilege Checks”.

* **Binary Log Checksums Off (to MySQL 8.0.20).** Up to and including MySQL 8.0.20, set `binlog_checksum=NONE`. In these releases, Group Replication cannot make use of checksums and does not support their presence in the binary log. From MySQL 8.0.21, Group Replication supports checksums, so group members may use the default setting `binlog_checksum=CRC32`, and you do not need to specify it.

* **Global Transaction Identifiers On.** Set `gtid_mode=ON` and `enforce_gtid_consistency=ON`. These settings are not the defaults. GTID-based replication is required for Group Replication, which uses global transaction identifiers to track the transactions that have been committed on every server instance in the group. See Section 19.1.3, “Replication with Global Transaction Identifiers”.

  In addition, if you need to set the value of `gtid_purged`, you must do so while Group Replication is not running.

* **Replication Information Repositories.** Set `master_info_repository=TABLE` and `relay_log_info_repository=TABLE`. In MySQL 8.0, these settings are the default, and the `FILE` setting is deprecated. From MySQL 8.0.23, the use of these system variables is deprecated, so omit the system variables and just allow the default. The replication applier needs to have the replication metadata written to the `mysql.slave_master_info` and `mysql.slave_relay_log_info` system tables to ensure the Group Replication plugin has consistent recoverability and transactional management of the replication metadata. See Section 19.2.4.2, “Replication Metadata Repositories”.

* **Transaction Write Set Extraction.** Set `transaction_write_set_extraction=XXHASH64` so that while collecting rows to log them to the binary log, the server collects the write set as well. In MySQL 8.0, this setting is the default, and from MySQL 8.0.26, the use of the system variable is deprecated. The write set is based on the primary keys of each row and is a simplified and compact view of a tag that uniquely identifies the row that was changed. Group Replication uses this information for conflict detection and certification on all group members.

* **Default Table Encryption.** Set `default_table_encryption` to the same value on all group members. Default schema and tablespace encryption can be either enabled (`ON`) or disabled (`OFF`, the default) as long as the setting is the same on all members.

  The value of `default_table_encryption` cannot be changed while Group Replication is running.

* **Lower Case Table Names.** Set `lower_case_table_names` to the same value on all group members. A setting of 1 is correct for the use of the `InnoDB` storage engine, which is required for Group Replication. Note that this setting is not the default on all platforms.

* **Binary Log Dependency Tracking.** Setting `binlog_transaction_dependency_tracking` to `WRITESET` can improve performance for a group member, depending on the group's workload. While Group Replication carries out its own parallelization after certification when applying transactions from the relay log, independently of any value set for `binlog_transaction_dependency_tracking`, this value does affect how transactions are written to the binary logs on Group Replication members. The dependency information in those logs is used to assist the process of state transfer for distributed recovery from a donor's binary log, which takes place whenever a member joins or rejoins the group.

  Note

  When `replica_preserve_commit_order` is `ON`, setting `binlog_transaction_dependency_tracking` to `WRITESET` has the same effect as setting it to `WRITESET_SESSION`.

* **Multithreaded Appliers.** Group Replication members can be configured as multithreaded replicas, enabling transactions to be applied in parallel. From MySQL 8.0.27, all replicas are configured as multithreaded by default. A nonzero value for the system variable `replica_parallel_workers` (from MySQL 8.0.26) or `slave_parallel_workers` (before MySQL 8.0.26) enables the multithreaded applier on the member. The default from MySQL 8.0.27 is 4 parallel applier threads, and up to 1024 parallel applier threads can be specified. For a multithreaded replica, the following settings are also required, which are the defaults from MySQL 8.0.27:

  `replica_preserve_commit_order=ON` (from MySQL 8.0.26) or `slave_preserve_commit_order=ON` (before MySQL 8.0.26) :   This setting is required to ensure that the final commit of parallel transactions is in the same order as the original transactions. Group Replication relies on consistency mechanisms built around the guarantee that all participating members receive and apply committed transactions in the same order.

  `replica_parallel_type=LOGICAL_CLOCK` (from MySQL 8.0.26) or `slave_parallel_type=LOGICAL_CLOCK` (before MySQL 8.0.26) :   This setting is required with `replica_preserve_commit_order=ON` or `slave_preserve_commit_order=ON`. It specifies the policy used to decide which transactions are allowed to execute in parallel on the replica.

  Setting `replica_parallel_workers=0` or `slave_parallel_workers=0` disables parallel execution and gives the replica a single applier thread and no coordinator thread. With that setting, the `replica_parallel_type` or `slave_parallel_type` and `replica_preserve_commit_order` or `slave_preserve_commit_order` options have no effect and are ignored. From MySQL 8.0.27, if parallel execution is disabled when GTIDs are in use on a replica, the replica actually uses one parallel worker, to take advantage of the method for retrying transactions without accessing the file positions. However, this behavior does not change anything for the user.

* **Detached XA transactions.** MySQL 8.0.29 and later supports detached XA transactions. A detached transaction is one which, once prepared, is no longer connected to the current session. This happens automatically as part of executing `XA PREPARE`. The prepared XA transaction can be committed or rolled back by another connection, and the current session can then initiate another XA transaction or local transaction without waiting for the transaction that was just prepared to complete.

  When detached XA transaction support is enabled (`xa_detach_on_prepare = ON`) it is possible for any connection to this server to list (using `XA RECOVER`), roll back, or commit any prepared XA transaction. In addition, you cannot use temporary tables within detached XA transactions.

  You can disable support for detached XA transactions by setting `xa_detach_on_prepare` to `OFF`, but this is not recommended. In particular, if this server is being set up as an instance in MySQL group replication, you should leave this variable set to its default value (`ON`).

  See Section 15.3.8.2, “XA Transaction States”, for more information.
