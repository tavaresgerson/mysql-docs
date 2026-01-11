#### 29.12.11.9 The replication_asynchronous_connection_failover_managed Table

This table holds configuration information used by the replica's asynchronous connection failover mechanism to handle managed groups, including Group Replication topologies.

When you add a group member to the source list and define it as part of a managed group, the asynchronous connection failover mechanism updates the source list to keep it in line with membership changes, adding and removing group members automatically as they join or leave. When asynchronous connection failover is enabled for a group of replicas managed by Group Replication, the source lists are broadcast to all group members when they join, and also when the lists change.

The asynchronous connection failover mechanism fails over the connection if another available server on the source list has a higher priority (weight) setting. For a managed group, a source’s weight is assigned depending on whether it is a primary or a secondary server. So assuming that you set up the managed group to give a higher weight to a primary and a lower weight to a secondary, when the primary changes, the higher weight is assigned to the new primary, so the replica changes over the connection to it. The asynchronous connection failover mechanism additionally changes connection if the currently connected managed source server leaves the managed group, or is no longer in the majority in the managed group. For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.

The `replication_asynchronous_connection_failover_managed` table has these columns:

* `CHANNEL_NAME`

  The replication channel where the servers for this managed group operate.

* `MANAGED_NAME`

  The identifier for the managed group. For the `GroupReplication` managed service, the identifier is the value of the `group_replication_group_name` system variable.

* `MANAGED_TYPE`

  The type of managed service that the asynchronous connection failover mechanism provides for this group. The only value currently available is `GroupReplication`.

* `CONFIGURATION`

  The configuration information for this managed group. For the `GroupReplication` managed service, the configuration shows the weights assigned to the group's primary server and to the group's secondary servers. For example: `{"Primary_weight": 80, "Secondary_weight": 60}`

  + `Primary_weight`: Integer between 0 and 100. Default value is 80.

  + `Secondary_weight`: Integer between 0 and 100. Default value is 60.

The `replication_asynchronous_connection_failover_managed` table has these indexes:

* Primary key on (`CHANNEL_NAME, MANAGED_NAME`)

`TRUNCATE TABLE` is not permitted for the `replication_asynchronous_connection_failover_managed` table.
