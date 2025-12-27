## 17.8 Frequently Asked Questions

This section provides answers to frequently asked questions.

### What is the maximum number of MySQL servers in a group?

A group can consist of maximum 9 servers. Attempting to add another server to a group with 9 members causes the request to join to be refused. This limit has been identified from testing and benchmarking as a safe boundary where the group performs reliably on a stable local area network.

### How are servers in a group connected?

Servers in a group connect to the other servers in the group by opening a peer-to-peer TCP connection. These connections are only used for internal communication and message passing between servers in the group. This address is configured by the [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) variable.

### What is the group\_replication\_bootstrap\_group option used for?

The bootstrap flag instructs a member to *create* a group and act as the initial seed server. The second member joining the group needs to ask the member that bootstrapped the group to dynamically change the configuration in order for it to be added to the group.

A member needs to bootstrap the group in two scenarios. When the group is originally created, or when shutting down and restarting the entire group.

### How do I set credentials for the recovery procedure?

You pre-configure the Group Replication recovery channel credentials using the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement.

### Can I scale-out my write-load using Group Replication?

Not directly, but MySQL Group replication is a shared nothing full replication solution, where all servers in the group replicate the same amount of data. Therefore if one member in the group writes N bytes to storage as the result of a transaction commit operation, then roughly N bytes are written to storage on other members as well, because the transaction is replicated everywhere.

However, given that other members do not have to do the same amount of processing that the original member had to do when it originally executed the transaction, they apply the changes faster. Transactions are replicated in a format that is used to apply row transformations only, without having to re-execute transactions again (row-based format).

Furthermore, given that changes are propagated and applied in row-based format, this means that they are received in an optimized and compact format, and likely reducing the number of IO operations required when compared to the originating member.

To summarize, you can scale-out processing, by spreading conflict free transactions throughout different members in the group. And you can likely scale-out a small fraction of your IO operations, since remote servers receive only the necessary changes to read-modify-write changes to stable storage.

### Does Group Replication require more network bandwidth and CPU, when compared to simple replication and under the same workload?

Some additional load is expected because servers need to be constantly interacting with each other for synchronization purposes. It is difficult to quantify how much more data. It also depends on the size of the group (three servers puts less stress on the bandwidth requirements than nine servers in the group).

Also the memory and CPU footprint are larger, because more complex work is done for the server synchronization part and for the group messaging.

### Can I deploy Group Replication across wide-area networks?

Yes, but the network connection between each member *must* be reliable and have suitable perfomance. Low latency, high bandwidth network connections are a requirement for optimal performance.

If network bandwidth alone is an issue, then [Section 17.9.7.2, “Message Compression”](group-replication-message-compression.html "17.9.7.2 Message Compression") can be used to lower the bandwidth required. However, if the network drops packets, leading to re-transmissions and higher end-to-end latency, throughput and latency are both negatively affected.

Warning

When the network round-trip time (RTT) between any group members is 5 seconds or more you could encounter problems as the built-in failure detection mechanism could be incorrectly triggered.

### Do members automatically rejoin a group in case of temporary connectivity problems?

This depends on the reason for the connectivity problem. If the connectivity problem is transient and the reconnection is quick enough that the failure detector is not aware of it, then the server may not be removed from the group. If it is a "long" connectivity problem, then the failure detector eventually suspects a problem and the server is removed from the group.

Once a server is removed from the group, you need to join it back again. In other words, after a server is removed explicitly from the group you need to rejoin it manually (or have a script doing it automatically).

### When is a member excluded from a group?

If the member becomes silent, the other members remove it from the group configuration. In practice this may happen when the member has crashed or there is a network disconnection.

The failure is detected after a given timeout elapses for a given member and a new configuration without the silent member in it is created.

### What happens when one node is significantly lagging behind?

There is no method for defining policies for when to expel members automatically from the group. You need to find out why a member is lagging behind and fix that or remove the member from the group. Otherwise, if the server is so slow that it triggers the flow control, then the entire group slows down as well. The flow control can be configured according to the your needs.

### Upon suspicion of a problem in the group, is there a special member responsible for triggering a reconfiguration?

No, there is no special member in the group in charge of triggering a reconfiguration.

Any member can suspect that there is a problem. All members need to (automatically) agree that a given member has failed. One member is in charge of expelling it from the group, by triggering a reconfiguration. Which member is responsible for expelling the member is not something you can control or set.

### Can I use Group Replication for sharding?

Group Replication is designed to provide highly available replica sets; data and writes are duplicated on each member in the group. For scaling beyond what a single system can provide, you need an orchestration and sharding framework built around a number of Group Replication sets, where each replica set maintains and manages a given shard or partition of your total dataset. This type of setup, often called a “sharded cluster”, allows you to scale reads and writes linearly and without limit.

### How do I use Group Replication with SELinux?

If SELinux is enabled, which you can verify using **sestatus -v**, then you need to enable the use of the Group Replication communication port. See [Setting the TCP Port Context for Group Replication](selinux-context-mysql-feature-ports.html#selinux-context-group-replication-port "Setting the TCP Port Context for Group Replication").

### How do I use Group Replication with iptables?

If **iptables** is enabled, then you need to open up the Group Replication port for communication between the machines. To see the current rules in place on each machine, issue **iptables -L**. Assuming the port configured is 33061, enable communication over the necessary port by issuing **iptables -A INPUT -p tcp --dport 33061 -j ACCEPT**.

### How do I recover the relay log for a replication channel used by a group member?

The replication channels used by Group Replication behave in the same way as replication channels used in source to replica replication, and as such rely on the relay log. In the event of a change of the [`relay_log`](replication-options-replica.html#sysvar_relay_log) variable, or when the option is not set and the host name changes, there is a chance of errors. See [Section 16.2.4.1, “The Relay Log”](replica-logs-relaylog.html "16.2.4.1 The Relay Log") for a recovery procedure in this situation. Alternatively, another way of fixing the issue specifically in Group Replication is to issue a [`STOP GROUP_REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement") statement and then a [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") statement to restart the instance. The Group Replication plugin creates the `group_replication_applier` channel again.

### Why does Group Replication use two bind addresses?

Group Replication uses two bind addresses in order to split network traffic between the SQL address, used by clients to communicate with the member, and the [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address), used internally by the group members to communicate. For example, assume a server with two network interfaces assigned to the network addresses `203.0.113.1` and `198.51.100.179`. In such a situation you could use `203.0.113.1:33061` for the internal group network address by setting [`group_replication_local_address=203.0.113.1:33061`](group-replication-system-variables.html#sysvar_group_replication_local_address). Then you could use `198.51.100.179` for [`hostname`](server-system-variables.html#sysvar_hostname) and `3306` for the [`port`](server-system-variables.html#sysvar_port). Client SQL applications would then connect to the member at `198.51.100.179:3306`. This enables you to configure different rules on the different networks. Similarly, the internal group communication can be separated from the network connection used for client applications, for increased security.

### How does Group Replication use network addresses and hostnames?

Group Replication uses network connections between members and therefore its functionality is directly impacted by how you configure hostnames and ports. For example, the Group Replication recovery procedure is based on asynchronous replication which uses the server's hostname and port. When a member joins a group it receives the group membership information, using the network address information that is listed at [`performance_schema.replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table"). One of the members listed in that table is selected as the donor of the missing data from the group to the new member.

This means that any value you configure using a hostname, such as the SQL network address or the group seeds address, must be a fully qualified name and resolvable by each member of the group. You can ensure this for example through DNS, or correctly configured `/etc/hosts` files, or other local processes. If a you want to configure the `MEMBER_HOST` value on a server, specify it using the [`--report-host`](replication-options-replica.html#sysvar_report_host) option on the server before joining it to the group.

Important

The assigned value is used directly and is not affected by the [`skip_name_resolve`](server-system-variables.html#sysvar_skip_name_resolve) system variable.

To configure `MEMBER_PORT` on a server, specify it using the [`report_port`](replication-options-replica.html#sysvar_report_port) system variable.

### Why did the auto increment setting on the server change?

When Group Replication is started on a server, the value of [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) is changed to the value of [`group_replication_auto_increment_increment`](group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment), which defaults to 7, and the value of [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) is changed to the server ID. The changes are reverted when Group Replication is stopped. These settings avoid the selection of duplicate auto-increment values for writes on group members, which causes rollback of transactions. The default auto increment value of 7 for Group Replication represents a balance between the number of usable values and the permitted maximum size of a replication group (9 members).

The changes are only made and reverted if [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) and [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) each have their default value of 1. If their values have already been modified from the default, Group Replication does not alter them.

### How do I find the primary?

If the group is operating in single-primary mode, it can be useful to find out which member is the primary. See [Section 17.5.1.3, “Finding the Primary”](group-replication-find-primary.html "17.5.1.3 Finding the Primary")
