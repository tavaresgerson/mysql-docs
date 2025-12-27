# Chapter 17 Group Replication

**Table of Contents**

[17.1 Group Replication Background](group-replication-background.html) :   [17.1.1 Replication Technologies](group-replication-replication-technologies.html)

    [17.1.2 Group Replication Use Cases](group-replication-use-cases.html)

    [17.1.3 Group Replication Details](group-replication-details.html)

[17.2 Getting Started](group-replication-getting-started.html) :   [17.2.1 Deploying Group Replication in Single-Primary Mode](group-replication-deploying-in-single-primary-mode.html)

    [17.2.2 Deploying Group Replication Locally](group-replication-deploying-locally.html)

[17.3 Requirements and Limitations](group-replication-requirements-and-limitations.html) :   [17.3.1 Group Replication Requirements](group-replication-requirements.html)

    [17.3.2 Group Replication Limitations](group-replication-limitations.html)

[17.4 Monitoring Group Replication](group-replication-monitoring.html) :   [17.4.1 Group Replication Server States](group-replication-server-states.html)

    [17.4.2 The replication\_group\_members Table](group-replication-replication-group-members.html)

    [17.4.3 The replication\_group\_member\_stats Table](group-replication-replication-group-member-stats.html)

[17.5 Group Replication Operations](group-replication-operations.html) :   [17.5.1 Deploying in Multi-Primary or Single-Primary Mode](group-replication-deploying-in-multi-primary-or-single-primary-mode.html)

    [17.5.2 Tuning Recovery](group-replication-tuning-recovery.html)

    [17.5.3 Network Partitioning](group-replication-network-partitioning.html)

    [17.5.4 Restarting a Group](group-replication-restarting-group.html)

    [17.5.5 Using MySQL Enterprise Backup with Group Replication](group-replication-enterprise-backup.html)

[17.6 Group Replication Security](group-replication-security.html) :   [17.6.1 Group Replication IP Address Allowlisting](group-replication-ip-address-permissions.html)

    [17.6.2 Group Replication Secure Socket Layer (SSL) Support](group-replication-secure-socket-layer-support-ssl.html)

    [17.6.3 Group Replication and Virtual Private Networks (VPNs)](group-replication-virtual-private-networks-vpn.html)

[17.7 Group Replication Variables](group-replication-options.html) :   [17.7.1 Group Replication System Variables](group-replication-system-variables.html)

    [17.7.2 Group Replication Status Variables](group-replication-status-variables.html)

[17.8 Frequently Asked Questions](group-replication-frequently-asked-questions.html)

[17.9 Group Replication Technical Details](group-replication-technical-details.html) :   [17.9.1 Group Replication Plugin Architecture](group-replication-plugin-architecture.html)

    [17.9.2 The Group](group-replication-the-group.html)

    [17.9.3 Data Manipulation Statements](group-replication-data-manipulation-statements.html)

    [17.9.4 Data Definition Statements](group-replication-data-definition-statements.html)

    [17.9.5 Distributed Recovery](group-replication-distributed-recovery.html)

    [17.9.6 Observability](group-replication-observability.html)

    [17.9.7 Group Replication Performance](group-replication-performance.html)

This chapter explains MySQL Group Replication and how to install, configure and monitor groups. MySQL Group Replication is a MySQL Server plugin that enables you to create elastic, highly-available, fault-tolerant replication topologies.

Groups can operate in a single-primary mode with automatic primary election, where only one server accepts updates at a time. Alternatively, for more advanced users, groups can be deployed in multi-primary mode, where all servers can accept updates, even if they are issued concurrently.

There is a built-in group membership service that keeps the view of the group consistent and available for all servers at any given point in time. Servers can leave and join the group and the view is updated accordingly. Sometimes servers can leave the group unexpectedly, in which case the failure detection mechanism detects this and notifies the group that the view has changed. This is all automatic.

The chapter is structured as follows:

* [Section 17.1, “Group Replication Background”](group-replication-background.html "17.1 Group Replication Background") provides an introduction to groups and how Group Replication works.

* [Section 17.2, “Getting Started”](group-replication-getting-started.html "17.2 Getting Started") explains how to configure multiple MySQL Server instances to create a group.

* [Section 17.3, “Requirements and Limitations”](group-replication-requirements-and-limitations.html "17.3 Requirements and Limitations") explains architecture and setup requirements and limitations for Group Replication.

* [Section 17.4, “Monitoring Group Replication”](group-replication-monitoring.html "17.4 Monitoring Group Replication") explains how to monitor a group.

* [Section 17.5, “Group Replication Operations”](group-replication-operations.html "17.5 Group Replication Operations") explains how to work with a group.

* [Section 17.6, “Group Replication Security”](group-replication-security.html "17.6 Group Replication Security") explains how to secure a group.

* [Upgrading Group Replication](/doc/refman/8.0/en/group-replication-upgrade.html) explains how to upgrade a group.

* [Section 17.7, “Group Replication Variables”](group-replication-options.html "17.7 Group Replication Variables") is a reference for the system variables specific to Group Replication.

* [Section 17.8, “Frequently Asked Questions”](group-replication-frequently-asked-questions.html "17.8 Frequently Asked Questions") provides answers to some technical questions about deploying and operating Group Replication.

* [Section 17.9, “Group Replication Technical Details”](group-replication-technical-details.html "17.9 Group Replication Technical Details") provides in-depth information about how Group Replication works.
