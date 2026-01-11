# Chapter 20 Group Replication

**Table of Contents**

20.1 Group Replication Background :   20.1.1 Replication Technologies

    20.1.2 Group Replication Use Cases

    20.1.3 Multi-Primary and Single-Primary Modes

    20.1.4 Group Replication Services

    20.1.5 Group Replication Plugin Architecture

20.2 Getting Started :   20.2.1 Deploying Group Replication in Single-Primary Mode

    20.2.2 Deploying Group Replication Locally

20.3 Requirements and Limitations :   20.3.1 Group Replication Requirements

    20.3.2 Group Replication Limitations

20.4 Monitoring Group Replication :   20.4.1 GTIDs and Group Replication

    20.4.2 Group Replication Server States

    20.4.3 The replication\_group\_members Table

    20.4.4 The replication\_group\_member\_stats Table

20.5 Group Replication Operations :   20.5.1 Configuring an Online Group

    20.5.2 Restarting a Group

    20.5.3 Transaction Consistency Guarantees

    20.5.4 Distributed Recovery

    20.5.5 Support For IPv6 And For Mixed IPv6 And IPv4 Groups

    20.5.6 Using MySQL Enterprise Backup with Group Replication

20.6 Group Replication Security :   20.6.1 Communication Stack for Connection Security Management

    20.6.2 Securing Group Communication Connections with Secure Socket Layer (SSL)

    20.6.3 Securing Distributed Recovery Connections

    20.6.4 Group Replication IP Address Permissions

20.7 Group Replication Performance and Troubleshooting :   20.7.1 Fine Tuning the Group Communication Thread

    20.7.2 Flow Control

    20.7.3 Single Consensus Leader

    20.7.4 Message Compression

    20.7.5 Message Fragmentation

    20.7.6 XCom Cache Management

    20.7.7 Responses to Failure Detection and Network Partitioning

    20.7.8 Handling a Network Partition and Loss of Quorum

    20.7.9 Monitoring Group Replication Memory Usage with Performance Schema Memory Instrumentation

20.8 Upgrading Group Replication :   20.8.1 Combining Different Member Versions in a Group

    20.8.2 Group Replication Offline Upgrade

    20.8.3 Group Replication Online Upgrade

20.9 Group Replication Variables :   20.9.1 Group Replication System Variables

    20.9.2 Group Replication Status Variables

20.10 Frequently Asked Questions

This chapter explains Group Replication in MySQL 9.5, and how to install, configure and monitor groups. MySQL Group Replication enables you to create elastic, highly-available, fault-tolerant replication topologies.

Groups can operate in a single-primary mode with automatic primary election, where only one server accepts updates at a time. Alternatively, groups can be deployed in multi-primary mode, where all servers can accept updates, even if they are issued concurrently.

There is a built-in group membership service that keeps the view of the group consistent and available for all servers at any given point in time. Servers can leave and join the group and the view is updated accordingly. Sometimes servers can leave the group unexpectedly, in which case the failure detection mechanism detects this and notifies the group that the view has changed. This is all automatic.

Group Replication guarantees that the database service is continuously available. However, it is important to understand that if one of the group members becomes unavailable, the clients connected to that group member must be redirected, or failed over, to a different server in the group, using a connector, load balancer, router, or some form of middleware. Group Replication does not have an inbuilt method to do this. For example, see MySQL Router 9.5.

Group Replication is provided as a plugin to MySQL Server. You can follow the instructions in this chapter to configure the plugin on each of the server instances that you want in the group, start up the group, and monitor and administer the group. An alternative way to deploy a group of MySQL server instances is by using InnoDB Cluster.

Tip

To deploy multiple instances of MySQL, you can use InnoDB Cluster which enables you to easily administer a group of MySQL server instances in MySQL Shell. InnoDB Cluster wraps MySQL Group Replication in a programmatic environment that enables you easily deploy a cluster of MySQL instances to achieve high availability. In addition, InnoDB Cluster interfaces seamlessly with MySQL Router, which enables your applications to connect to the cluster without writing your own failover process. For similar use cases that do not require high availability, however, you can use InnoDB ReplicaSet. Installation instructions for MySQL Shell can be found here.

MySQL 9.5 and later support a number of MySQL components for use with MySQL Group Replication. See Section 7.5.6, “Replication Components”, for more information.

This chapter is structured as follows:

* Section 20.1, “Group Replication Background” provides an introduction to groups and how Group Replication works.

* Section 20.2, “Getting Started” explains how to configure multiple MySQL Server instances to create a group.

* Section 20.3, “Requirements and Limitations” explains architecture and setup requirements and limitations for Group Replication.

* Section 20.4, “Monitoring Group Replication” explains how to monitor a group.

* Section 20.5, “Group Replication Operations” explains how to work with a group.

* Section 20.6, “Group Replication Security” explains how to secure a group.

* Section 20.7, “Group Replication Performance and Troubleshooting” explains how to fine tune performance for a group.

* Section 20.8, “Upgrading Group Replication” explains how to upgrade a group.

* Section 20.9, “Group Replication Variables” is a reference for the system variables specific to Group Replication.

* Section 20.10, “Frequently Asked Questions” provides answers to some technical questions about deploying and operating Group Replication.
