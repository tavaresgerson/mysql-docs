#### 17.2.1.2 Configuring an Instance for Group Replication

This section explains the configuration settings required for MySQL Server instances that you want to use for Group Replication. For background information, see [Section 17.3, “Requirements and Limitations”](group-replication-requirements-and-limitations.html "17.3 Requirements and Limitations").

* [Storage Engines](group-replication-configuring-instances.html#group-replication-storage-engines "Storage Engines")
* [Replication Framework](group-replication-configuring-instances.html#group-replication-configure-replication-framework "Replication Framework")
* [Group Replication Settings](group-replication-configuring-instances.html#group-replication-configure-plugin "Group Replication Settings")

##### Storage Engines

For Group Replication, data must be stored in the InnoDB transactional storage engine (for details of why, see [Section 17.3.1, “Group Replication Requirements”](group-replication-requirements.html "17.3.1 Group Replication Requirements")). The use of other storage engines, including the temporary [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine") storage engine, might cause errors in Group Replication. Set the [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) system variable as follows to prevent their use:

```sql
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
```

Note that with the [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") storage engine disabled, when you are upgrading a MySQL instance to a release where [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") is still used (before MySQL 8.0.16), [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") might fail with an error. To handle this, you can re-enable that storage engine while you run [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables"), then disable it again when you restart the server. For more information, see [Section 4.4.7, “mysql\_upgrade — Check and Upgrade MySQL Tables”](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables").

##### Replication Framework

The following settings configure replication according to the MySQL Group Replication requirements.

```sql
server_id=1
gtid_mode=ON
enforce_gtid_consistency=ON
master_info_repository=TABLE
relay_log_info_repository=TABLE
binlog_checksum=NONE
log_slave_updates=ON
log_bin=binlog
binlog_format=ROW
```

These settings configure the server to use the unique identifier number 1, to enable global transaction identifiers and to store replication metadata in system tables instead of files. Additionally, it instructs the server to turn on binary logging, use row-based format and disable binary log event checksums. For more details see [Section 17.3.1, “Group Replication Requirements”](group-replication-requirements.html "17.3.1 Group Replication Requirements").

##### Group Replication Settings

At this point the option file ensures that the server is configured and is instructed to instantiate the replication infrastructure under a given configuration. The following section configures the Group Replication settings for the server.

```sql
plugin_load_add='group_replication.so'
transaction_write_set_extraction=XXHASH64
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s1:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group=off
```

* `plugin-load-add` adds the Group Replication plugin to the list of plugins which the server loads at startup. This is preferable in a production deployment to installing the plugin manually.

* Configuring [`group_replication_group_name`](group-replication-system-variables.html#sysvar_group_replication_group_name) tells the plugin that the group that it is joining, or creating, is named "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa".

  The value of [`group_replication_group_name`](group-replication-system-variables.html#sysvar_group_replication_group_name) must be a valid UUID. This UUID is used internally when setting GTIDs for Group Replication events in the binary log. You can use `SELECT UUID()` to generate a UUID.

* Configuring the [`group_replication_start_on_boot`](group-replication-system-variables.html#sysvar_group_replication_start_on_boot) variable to `off` instructs the plugin to not start operations automatically when the server starts. This is important when setting up Group Replication as it ensures you can configure the server before manually starting the plugin. Once the member is configured you can set [`group_replication_start_on_boot`](group-replication-system-variables.html#sysvar_group_replication_start_on_boot) to `on` so that Group Replication starts automatically upon server boot.

* Configuring [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) sets the network address and port which the member uses for internal communication with other members in the group. Group Replication uses this address for internal member-to-member connections involving remote instances of the group communication engine (XCom, a Paxos variant).

  Important

  This address must be different to the [`hostname`](server-system-variables.html#sysvar_hostname) and [`port`](server-system-variables.html#sysvar_port) used for SQL and it must not be used for client applications. It must be only be used for internal communication between the members of the group while running Group Replication.

  The network address configured by [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) must be resolvable by all group members. For example, if each server instance is on a different machine with a fixed network address, you could use the IP address of the machine, such as 10.0.0.1. If you use a host name, you must use a fully qualified name, and ensure it is resolvable through DNS, correctly configured `/etc/hosts` files, or other name resolution processes. From MySQL 8.0.14, IPv6 addresses (or host names that resolve to them) can be used as well as IPv4 addresses. A group can contain a mix of members using IPv6 and members using IPv4. For more information on Group Replication support for IPv6 networks and on mixed IPv4 and IPv6 groups, see [Support For IPv6 And For Mixed IPv6 And IPv4 Groups](/doc/refman/8.0/en/group-replication-ipv6.html).

  The recommended port for [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) is 33061. [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) is used by Group Replication as the unique identifier for a group member within the replication group. You can use the same port for all members of a replication group as long as the host names or IP addresses are all different, as demonstrated in this tutorial. Alternatively you can use the same host name or IP address for all members as long as the ports are all different, for example as shown in [Section 17.2.2, “Deploying Group Replication Locally”](group-replication-deploying-locally.html "17.2.2 Deploying Group Replication Locally").

* Configuring [`group_replication_group_seeds`](group-replication-system-variables.html#sysvar_group_replication_group_seeds) sets the hostname and port of the group members which are used by the new member to establish its connection to the group. These members are called the seed members. Once the connection is established, the group membership information is listed at [`performance_schema.replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table"). Usually the [`group_replication_group_seeds`](group-replication-system-variables.html#sysvar_group_replication_group_seeds) list contains the `hostname:port` of each of the group member's [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address), but this is not obligatory and a subset of the group members can be chosen as seeds.

  Important

  The `hostname:port` listed in [`group_replication_group_seeds`](group-replication-system-variables.html#sysvar_group_replication_group_seeds) is the seed member's internal network address, configured by [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) and not the SQL `hostname:port` used for client connections, and shown for example in [`performance_schema.replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table") table.

  The server that starts the group does not make use of this option, since it is the initial server and as such, it is in charge of bootstrapping the group. In other words, any existing data which is on the server bootstrapping the group is what is used as the data for the next joining member. The second server joining asks the one and only member in the group to join, any missing data on the second server is replicated from the donor data on the bootstrapping member, and then the group expands. The third server joining can ask any of these two to join, data is synchronized to the new member, and then the group expands again. Subsequent servers repeat this procedure when joining.

  Warning

  When joining multiple servers at the same time, make sure that they point to seed members that are already in the group. Do not use members that are also joining the group as seeds, because they might not yet be in the group when contacted.

  It is good practice to start the bootstrap member first, and let it create the group. Then make it the seed member for the rest of the members that are joining. This ensures that there is a group formed when joining the rest of the members.

  Creating a group and joining multiple members at the same time is not supported. It might work, but chances are that the operations race and then the act of joining the group ends up in an error or a time out.

* Configuring [`group_replication_bootstrap_group`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group) instructs the plugin whether to bootstrap the group or not. In this case, even though s1 is the first member of the group we set this variable to off in the option file. Instead we configure [`group_replication_bootstrap_group`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group) when the instance is running, to ensure that only one member actually bootstraps the group.

  Important

  The [`group_replication_bootstrap_group`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group) variable must only be enabled on one server instance belonging to a group at any time, usually the first time you bootstrap the group (or in case the entire group is brought down and back up again). If you bootstrap the group multiple times, for example when multiple server instances have this option set, then they could create an artificial split brain scenario, in which two distinct groups with the same name exist. Always set [`group_replication_bootstrap_group=off`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group) after the first server instance comes online.

Configuration for all servers in the group is quite similar. You need to change the specifics about each server (for example [`server_id`](replication-options.html#sysvar_server_id), [`datadir`](server-system-variables.html#sysvar_datadir), [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address)). This is illustrated later in this tutorial.
