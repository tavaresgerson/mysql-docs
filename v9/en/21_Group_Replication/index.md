# Chapter 20 Group Replication

**Table of Contents**

[20.1 Group Replication Background](group-replication-background.html)
:   [20.1.1 Replication Technologies](group-replication-replication-technologies.html)

    [20.1.2 Group Replication Use Cases](group-replication-use-cases.html)

    [20.1.3 Multi-Primary and Single-Primary Modes](group-replication-deploying-in-multi-primary-or-single-primary-mode.html)

    [20.1.4 Group Replication Services](group-replication-details.html)

    [20.1.5 Group Replication Plugin Architecture](group-replication-plugin-architecture.html)

[20.2 Getting Started](group-replication-getting-started.html)
:   [20.2.1 Deploying Group Replication in Single-Primary Mode](group-replication-deploying-in-single-primary-mode.html)

    [20.2.2 Deploying Group Replication Locally](group-replication-deploying-locally.html)

[20.3 Requirements and Limitations](group-replication-requirements-and-limitations.html)
:   [20.3.1 Group Replication Requirements](group-replication-requirements.html)

    [20.3.2 Group Replication Limitations](group-replication-limitations.html)

[20.4 Monitoring Group Replication](group-replication-monitoring.html)
:   [20.4.1 GTIDs and Group Replication](group-replication-gtids.html)

    [20.4.2 Group Replication Server States](group-replication-server-states.html)

    [20.4.3 The replication\_group\_members Table](group-replication-replication-group-members.html)

    [20.4.4 The replication\_group\_member\_stats Table](group-replication-replication-group-member-stats.html)

[20.5 Group Replication Operations](group-replication-operations.html)
:   [20.5.1 Configuring an Online Group](group-replication-configuring-online-group.html)

    [20.5.2 Restarting a Group](group-replication-restarting-group.html)

    [20.5.3 Transaction Consistency Guarantees](group-replication-consistency-guarantees.html)

    [20.5.4 Distributed Recovery](group-replication-distributed-recovery.html)

    [20.5.5 Support For IPv6 And For Mixed IPv6 And IPv4 Groups](group-replication-ipv6.html)

    [20.5.6 Using MySQL Enterprise Backup with Group Replication](group-replication-enterprise-backup.html)

[20.6 Group Replication Security](group-replication-security.html)
:   [20.6.1 Communication Stack for Connection Security Management](group-replication-connection-security.html)

    [20.6.2 Securing Group Communication Connections with Secure Socket Layer (SSL)](group-replication-secure-socket-layer-support-ssl.html)

    [20.6.3 Securing Distributed Recovery Connections](group-replication-distributed-recovery-securing.html)

    [20.6.4 Group Replication IP Address Permissions](group-replication-ip-address-permissions.html)

[20.7 Group Replication Performance and Troubleshooting](group-replication-performance.html)
:   [20.7.1 Fine Tuning the Group Communication Thread](group-replication-fine-tuning-the-group-communication-thread.html)

    [20.7.2 Flow Control](group-replication-flow-control.html)

    [20.7.3 Single Consensus Leader](group-replication-single-consensus-leader.html)

    [20.7.4 Message Compression](group-replication-message-compression.html)

    [20.7.5 Message Fragmentation](group-replication-performance-message-fragmentation.html)

    [20.7.6 XCom Cache Management](group-replication-performance-xcom-cache.html)

    [20.7.7 Responses to Failure Detection and Network Partitioning](group-replication-responses-failure.html)

    [20.7.8 Handling a Network Partition and Loss of Quorum](group-replication-network-partitioning.html)

    [20.7.9 Monitoring Group Replication Memory Usage with Performance Schema Memory Instrumentation](mysql-gr-memory-monitoring-ps-instruments.html)

[20.8 Upgrading Group Replication](group-replication-upgrade.html)
:   [20.8.1 Combining Different Member Versions in a Group](group-replication-online-upgrade-combining-versions.html)

    [20.8.2 Group Replication Offline Upgrade](group-replication-offline-upgrade.html)

    [20.8.3 Group Replication Online Upgrade](group-replication-online-upgrade.html)

[20.9 Group Replication Variables](group-replication-options.html)
:   [20.9.1 Group Replication System Variables](group-replication-system-variables.html)

    [20.9.2 Group Replication Status Variables](group-replication-status-variables.html)

[20.10 Frequently Asked Questions](group-replication-frequently-asked-questions.html)

This chapter explains Group Replication in MySQL 9.5,
and how to install, configure and monitor groups. MySQL Group
Replication enables you to create elastic, highly-available,
fault-tolerant replication topologies.

Groups can operate in a single-primary mode with automatic primary
election, where only one server accepts updates at a time.
Alternatively, groups can be deployed in multi-primary mode, where
all servers can accept updates, even if they are issued
concurrently.

There is a built-in group membership service that keeps the view of
the group consistent and available for all servers at any given
point in time. Servers can leave and join the group and the view is
updated accordingly. Sometimes servers can leave the group
unexpectedly, in which case the failure detection mechanism detects
this and notifies the group that the view has changed. This is all
automatic.

Group Replication guarantees that the database service is
continuously available. However, it is important to understand that
if one of the group members becomes unavailable, the clients
connected to that group member must be redirected, or failed over,
to a different server in the group, using a connector, load
balancer, router, or some form of middleware. Group Replication does
not have an inbuilt method to do this. For example, see
[MySQL Router 9.5](/doc/mysql-router/9.5/en/).

Group Replication is provided as a plugin to MySQL Server. You can
follow the instructions in this chapter to configure the plugin on
each of the server instances that you want in the group, start up
the group, and monitor and administer the group. An alternative way
to deploy a group of MySQL server instances is by using
InnoDB Cluster.

Tip

To deploy multiple instances of MySQL, you can use [InnoDB Cluster](/doc/mysql-shell/9.5/en/mysql-innodb-cluster.html) which enables you to easily administer a group of MySQL server instances in [MySQL Shell](/doc/mysql-shell/9.5/en/). InnoDB Cluster wraps MySQL Group Replication in a programmatic environment that enables you easily deploy a cluster of MySQL instances to achieve high availability. In addition, InnoDB Cluster interfaces seamlessly with [MySQL Router](/doc/mysql-router/9.5/en/), which enables your applications to connect to the cluster without writing your own failover process. For similar use cases that do not require high availability, however, you can use [InnoDB ReplicaSet](/doc/mysql-shell/9.5/en/mysql-innodb-replicaset.html). Installation instructions for MySQL Shell can be found [here](/doc/mysql-shell/9.5/en/mysql-shell-install.html).

MySQL 9.5 and later support a number of MySQL
components for use with MySQL Group Replication. See
[Section 7.5.6, “Replication Components”](replication-components.html "7.5.6 Replication Components"), for more information.

This chapter is structured as follows:

* [Section 20.1, “Group Replication Background”](group-replication-background.html "20.1 Group Replication Background") provides an
  introduction to groups and how Group Replication works.

* [Section 20.2, “Getting Started”](group-replication-getting-started.html "20.2 Getting Started") explains how
  to configure multiple MySQL Server instances to create a group.

* [Section 20.3, “Requirements and Limitations”](group-replication-requirements-and-limitations.html "20.3 Requirements and Limitations")
  explains architecture and setup requirements and limitations for
  Group Replication.

* [Section 20.4, “Monitoring Group Replication”](group-replication-monitoring.html "20.4 Monitoring Group Replication") explains how to
  monitor a group.

* [Section 20.5, “Group Replication Operations”](group-replication-operations.html "20.5 Group Replication Operations") explains how to
  work with a group.

* [Section 20.6, “Group Replication Security”](group-replication-security.html "20.6 Group Replication Security") explains how to
  secure a group.

* [Section 20.7, “Group Replication Performance and Troubleshooting”](group-replication-performance.html "20.7 Group Replication Performance and Troubleshooting") explains how to
  fine tune performance for a group.

* [Section 20.8, “Upgrading Group Replication”](group-replication-upgrade.html "20.8 Upgrading Group Replication") explains how to
  upgrade a group.

* [Section 20.9, “Group Replication Variables”](group-replication-options.html "20.9 Group Replication Variables") is a reference for
  the system variables specific to Group Replication.

* [Section 20.10, “Frequently Asked Questions”](group-replication-frequently-asked-questions.html "20.10 Frequently Asked Questions")
  provides answers to some technical questions about deploying and
  operating Group Replication.