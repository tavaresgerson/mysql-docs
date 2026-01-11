#### 7.6.7.7 Cloning for Replication

The clone plugin supports replication. In addition to cloning data, a cloning operation extracts replication coordinates from the donor and transfers them to the recipient, which enables using the clone plugin for provisioning Group Replication members and replicas. Using the clone plugin for provisioning is considerably faster and more efficient than replicating a large number of transactions.

Group Replication members can also be configured to use the clone plugin as an option for distributed recovery, in which case joining members automatically choose the most efficient way to retrieve group data from existing group members. For more information, see Section 20.5.4.2, “Cloning for Distributed Recovery”.

During the cloning operation, both the binary log position (filename, offset) and the `gtid_executed` GTID set are extracted and transferred from the donor MySQL server instance to the recipient. This data permits initiating replication at a consistent position in the replication stream. The binary logs and relay logs, which are held in files, are not copied from the donor to the recipient. To initiate replication, the binary logs required for the recipient to catch up to the donor must not be purged between the time that the data is cloned and the time that replication is started. If the required binary logs are not available, a replication handshake error is reported. A cloned instance should therefore be added to a replication group without excessive delay to avoid required binary logs being purged or the new member lagging behind significantly, requiring more recovery time.

* Issue this query on a cloned MySQL server instance to check the binary log position that was transferred to the recipient:

  ```
  mysql> SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
  ```

* Issue this query on a cloned MySQL server instance to check the `gtid_executed` GTID set that was transferred to the recipient:

  ```
  mysql> SELECT @@GLOBAL.GTID_EXECUTED;
  ```

By default in MySQL 8.0, the replication metadata repositories are held in tables that are copied from the donor to the recipient during the cloning operation. The replication metadata repositories hold replication-related configuration settings that can be used to resume replication correctly after the cloning operation.

* In MySQL 8.0.17 and 8.0.18, only the table `mysql.slave_master_info` (the connection metadata repository) is copied.

* From MySQL 8.0.19, the tables `mysql.slave_relay_log_info` (the applier metadata repository) and `mysql.slave_worker_info` (the applier worker metadata repository) are also copied.

For a list of what is included in each table, see Section 19.2.4.2, “Replication Metadata Repositories”. Note that if the settings `master_info_repository=FILE` and `relay_log_info_repository=FILE` are used on the server (which is not the default in MySQL 8.0 and is deprecated), the replication metadata repositories are not cloned; they are only cloned if `TABLE` is set.

To clone for replication, perform the following steps:

1. For a new group member for Group Replication, first configure the MySQL Server instance for Group Replication, following the instructions in Section 20.2.1.6, “Adding Instances to the Group”. Also set up the prerequisites for cloning described in Section 20.5.4.2, “Cloning for Distributed Recovery”. When you issue `START GROUP_REPLICATION` on the joining member, the cloning operation is managed automatically by Group Replication, so you do not need to carry out the operation manually, and you do not need to perform any further setup steps on the joining member.

2. For a replica in a source/replica MySQL replication topology, first clone the data from the donor MySQL server instance to the recipient manually. The donor must be a source or replica in the replication topology. For cloning instructions, see Section 7.6.7.3, “Cloning Remote Data”.

3. After the cloning operation completes successfully, if you want to use the same replication channels on the recipient MySQL server instance that were present on the donor, verify which of them can resume replication automatically in the source/replica MySQL replication topology, and which need to be set up manually.

   * For GTID-based replication, if the recipient is configured with `gtid_mode=ON` and has cloned from a donor with `gtid_mode=ON`, `ON_PERMISSIVE`, or `OFF_PERMISSIVE`, the `gtid_executed` GTID set from the donor is applied on the recipient. If the recipient is cloned from a replica already in the topology, replication channels on the recipient that use GTID auto-positioning can resume replication automatically after the cloning operation when the channel is started. You do not need to perform any manual setup if you just want to use these same channels.

   * For binary log file position based replication, if the recipient is at MySQL 8.0.17 or 8.0.18, the binary log position from the donor is not applied on the recipient, only recorded in the Performance Schema `clone_status` table. Replication channels on the recipient that use binary log file position based replication must therefore be set up manually to resume replication after the cloning operation. Ensure that these channels are not configured to start replication automatically at server startup, as they do not yet have the binary log position and attempt to start replication from the beginning.

   * For binary log file position based replication, if the recipient is at MySQL 8.0.19 or above, the binary log position from the donor is applied on the recipient. Replication channels on the recipient that use binary log file position based replication automatically attempt to carry out the relay log recovery process, using the cloned relay log information, before restarting replication. For a single-threaded replica (`replica_parallel_workers` or `slave_parallel_workers` is set to 0), relay log recovery should succeed in the absence of any other issues, enabling the channel to resume replication with no further setup. For a multithreaded replica (`replica_parallel_workers` or `slave_parallel_workers` is greater than 0), relay log recovery is likely to fail because it cannot usually be completed automatically. In this case, an error message is issued, and you must set the channel up manually.

4. If you need to set up cloned replication channels manually, or want to use different replication channels on the recipient, the following instructions provide a summary and abbreviated examples for adding a recipient MySQL server instance to a replication topology. Also refer to the detailed instructions that apply to your replication setup.

   * To add a recipient MySQL server instance to a MySQL replication topology that uses GTID-based transactions as the replication data source, configure the instance as required, following the instructions in Section 19.1.3.4, “Setting Up Replication Using GTIDs”. Add replication channels for the instance as shown in the following abbreviated example. The `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or `CHANGE MASTER TO` statement (before MySQL 8.0.23) must define the host address and port number of the source, and the `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION` option should be enabled, as shown:

     ```
     mysql> CHANGE MASTER TO MASTER_HOST = 'source_host_name', MASTER_PORT = source_port_num,
            ...
            MASTER_AUTO_POSITION = 1,
            FOR CHANNEL 'setup_channel';
     mysql> START SLAVE USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';

     Or from MySQL 8.0.22 and 8.0.23:

     mysql> CHANGE SOURCE TO SOURCE_HOST = 'source_host_name', SOURCE_PORT = source_port_num,
            ...
            SOURCE_AUTO_POSITION = 1,
            FOR CHANNEL 'setup_channel';
     mysql> START REPLICA USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';
     ```

   * To add a recipient MySQL server instance to a MySQL replication topology that uses binary log file position based replication, configure the instance as required, following the instructions in Section 19.1.2, “Setting Up Binary Log File Position Based Replication”. Add replication channels for the instance as shown in the following abbreviated example, using the binary log position that was transferred to the recipient during the cloning operation:

     ```
     mysql> SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
     mysql> CHANGE MASTER TO MASTER_HOST = 'source_host_name', MASTER_PORT = source_port_num,
            ...
            MASTER_LOG_FILE = 'source_log_name',
            MASTER_LOG_POS = source_log_pos,
            FOR CHANNEL 'setup_channel';
     mysql> START SLAVE USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';

     Or from MySQL 8.0.22 and 8.0.23:

     mysql> SELECT BINLOG_FILE, BINLOG_POSITION FROM performance_schema.clone_status;
     mysql> CHANGE SOURCE TO SOURCE_HOST = 'source_host_name', SOURCE_PORT = source_port_num,
            ...
            SOURCE_LOG_FILE = 'source_log_name',
            SOURCE_LOG_POS = source_log_pos,
            FOR CHANNEL 'setup_channel';
     mysql> START REPLICA USER = 'user_name' PASSWORD = 'password' FOR CHANNEL 'setup_channel';
     ```
