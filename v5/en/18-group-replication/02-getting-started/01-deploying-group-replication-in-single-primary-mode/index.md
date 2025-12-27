### 17.2.1 Deploying Group Replication in Single-Primary Mode

[17.2.1.1 Deploying Instances for Group Replication](group-replication-deploying-instances.html)

[17.2.1.2 Configuring an Instance for Group Replication](group-replication-configuring-instances.html)

[17.2.1.3 User Credentials](group-replication-user-credentials.html)

[17.2.1.4 Launching Group Replication](group-replication-launching.html)

[17.2.1.5 Bootstrapping the Group](group-replication-bootstrap.html)

[17.2.1.6 Adding Instances to the Group](group-replication-adding-instances.html)

Each of the MySQL server instances in a group can run on an independent physical host machine, which is the recommended way to deploy Group Replication. This section explains how to create a replication group with three MySQL Server instances, each running on a different host machine. See [Section 17.2.2, “Deploying Group Replication Locally”](group-replication-deploying-locally.html "17.2.2 Deploying Group Replication Locally") for information about deploying multiple MySQL server instances running Group Replication on the same host machine, for example for testing purposes.

**Figure 17.4 Group Architecture**

![Three server instances, S1, S2, and S3, are deployed as an interconnected group, and clients communicate with each of the server instances.](images/gr-3-server-group.png)

This tutorial explains how to get and deploy MySQL Server with the Group Replication plugin, how to configure each server instance before creating a group, and how to use Performance Schema monitoring to verify that everything is working correctly.
