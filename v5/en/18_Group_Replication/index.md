# Chapter 17 Group Replication

This chapter explains MySQL Group Replication and how to install, configure and monitor groups. MySQL Group Replication is a MySQL Server plugin that enables you to create elastic, highly-available, fault-tolerant replication topologies.

Groups can operate in a single-primary mode with automatic primary election, where only one server accepts updates at a time. Alternatively, for more advanced users, groups can be deployed in multi-primary mode, where all servers can accept updates, even if they are issued concurrently.

There is a built-in group membership service that keeps the view of the group consistent and available for all servers at any given point in time. Servers can leave and join the group and the view is updated accordingly. Sometimes servers can leave the group unexpectedly, in which case the failure detection mechanism detects this and notifies the group that the view has changed. This is all automatic.

The chapter is structured as follows:

* Section 17.1, “Group Replication Background” provides an introduction to groups and how Group Replication works.

* Section 17.2, “Getting Started” explains how to configure multiple MySQL Server instances to create a group.

* Section 17.3, “Requirements and Limitations” explains architecture and setup requirements and limitations for Group Replication.

* Section 17.4, “Monitoring Group Replication” explains how to monitor a group.

* Section 17.5, “Group Replication Operations” explains how to work with a group.

* Section 17.6, “Group Replication Security” explains how to secure a group.

* Upgrading Group Replication explains how to upgrade a group.

* Section 17.7, “Group Replication Variables” is a reference for the system variables specific to Group Replication.

* Section 17.8, “Frequently Asked Questions” provides answers to some technical questions about deploying and operating Group Replication.

* Section 17.9, “Group Replication Technical Details” provides in-depth information about how Group Replication works.