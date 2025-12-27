### 14.18.3 Asynchronous Replication Channel Failover Functions

The following functions enable you to add or remove replication source servers to or from the source list for a replication channel, as well as clear the source list for a given server.

**Table 14.27 Failover Channel Functions**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>asynchronous_connection_failover_add_managed()</code></td> <td> Add group member source server configuration information to a replication channel source list </td> </tr><tr><td><code>asynchronous_connection_failover_add_source()</code></td> <td> Add source server configuration information server to a replication channel source list </td> </tr><tr><td><code>asynchronous_connection_failover_delete_managed()</code></td> <td> Remove a managed group from a replication channel source list </td> </tr><tr><td><code>asynchronous_connection_failover_delete_source()</code></td> <td> Remove a source server from a replication channel source list </td> </tr><tr><td><code>asynchronous_connection_failover_reset()</code></td> <td> Remove all settings relating to group replication asynchronous failover </td> </tr></tbody></table>

The asynchronous connection failover mechanism automatically establishes an asynchronous (source to replica) replication connection to a new source from the appropriate list after the existing connection from the replica to its source fails. The connection is also changed if the currently connected source does not have the highest weighted priority in the group. For Group Replication source servers that are defined as part of a managed group, the connection is also failed over to another group member if the currently connected source leaves the group or is no longer in the majority. For more information on the mechanism, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.

Source lists are stored in the `mysql.replication_asynchronous_connection_failover` and `mysql.replication_asynchronous_connection_failover_managed` tables, and can be viewed in the Performance Schema `replication_asynchronous_connection_failover` table.

If the replication channel is on a Group Replication primary for a group where failover between replicas is active, the source list is broadcast to all the group members when they join or when it is updated by any method. Failover between replicas is controlled by the `mysql_start_failover_channels_if_primary` member action, which is enabled by default, and can be disabled using the `group_replication_disable_member_action` function.

*  `asynchronous_connection_failover_add_managed()`

  Add configuration information for a replication source server that is part of a managed group (a Group Replication group member) to the source list for a replication channel. You only need to add one group member. The replica automatically adds the rest from the current group membership, then keeps the source list updated in line with membership change.

  Syntax:

  ```
  asynchronous_connection_failover_add_managed(channel, managed_type, managed_name, host, port, network_namespace, primary_weight, secondary_weight)
  ```

  Arguments:

  + *`channel`*: The replication channel for which this replication source server is part of the source list.
  + *`managed_type`*: The type of managed service that the asynchronous connection failover mechanism must provide for this server. The only value currently accepted is `GroupReplication`.
  + *`managed_name`*: The identifier for the managed group that the server is a part of. For the `GroupReplication` managed service, the identifier is the value of the `group_replication_group_name` system variable.
  + *`host`*: The host name for this replication source server.
  + *`port`*: The port number for this replication source server.
  + *`network_namespace`*: The network namespace for this replication source server. Specify an empty string, as this parameter is reserved for future use.
  + *`primary_weight`*: The priority of this replication source server in the replication channel's source list when it is acting as the primary for the managed group. The weight is from 1 to 100, with 100 being the highest. For the primary, 80 is a suitable weight. The asynchronous connection failover mechanism activates if the currently connected source is not the highest weighted in the group. Assuming that you set up the managed group to give a higher weight to a primary and a lower weight to a secondary, when the primary changes, its weight increases, and the replica changes over the connection to it.
  + *`secondary_weight`*: The priority of this replication source server in the replication channel's source list when it is acting as a secondary in the managed group. The weight is from 1 to 100, with 100 being the highest. For a secondary, 60 is a suitable weight.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT asynchronous_connection_failover_add_managed('channel2', 'GroupReplication', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '127.0.0.1', 3310, '', 80, 60);
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_add_source('channel2', 'GroupReplication', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '127.0.0.1', 3310, '', 80, 60) |
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  | Source managed configuration details successfully inserted.                                                                                        |
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  ```

  For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.
*  `asynchronous_connection_failover_add_source()`

  Add configuration information for a replication source server to the source list for a replication channel.

  Syntax:

  ```
  asynchronous_connection_failover_add_source(channel, host, port, network_namespace, weight)
  ```

  Arguments:

  + *`channel`*: The replication channel for which this replication source server is part of the source list.
  + *`host`*: The host name for this replication source server.
  + *`port`*: The port number for this replication source server.
  + *`network_namespace`*: The network namespace for this replication source server. Specify an empty string, as this parameter is reserved for future use.
  + *`weight`*: The priority of this replication source server in the replication channel's source list. The priority is from 1 to 100, with 100 being the highest, and 50 being the default. When the asynchronous connection failover mechanism activates, the source with the highest priority setting among the alternative sources listed in the source list for the channel is chosen for the first connection attempt. If this attempt does not work, the replica tries with all the listed sources in descending order of priority, then starts again from the highest priority source. If multiple sources have the same priority, the replica orders them randomly. The asynchronous connection failover mechanism activates if the source currently connected is not the highest weighted in the group.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT asynchronous_connection_failover_add_source('channel2', '127.0.0.1', 3310, '', 80);
  +-------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_add_source('channel2', '127.0.0.1', 3310, '', 80)              |
  +-------------------------------------------------------------------------------------------------+
  | Source configuration details successfully inserted.                                             |
  +-------------------------------------------------------------------------------------------------+
  ```

  For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.
*  `asynchronous_connection_failover_delete_managed()`

  Remove an entire managed group from the source list for a replication channel. When you use this function, all the replication source servers defined in the managed group are removed from the channel's source list.

  Syntax:

  ```
  asynchronous_connection_failover_delete_managed(channel, managed_name)
  ```

  Arguments:

  + *`channel`*: The replication channel for which this replication source server was part of the source list.
  + *`managed_name`*: The identifier for the managed group that the server is a part of. For the `GroupReplication` managed service, the identifier is the value of the `group_replication_group_name` system variable.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT asynchronous_connection_failover_delete_managed('channel2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
  +-----------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_delete_managed('channel2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') |
  +-----------------------------------------------------------------------------------------------------+
  | Source managed configuration details successfully deleted.                                          |
  +-----------------------------------------------------------------------------------------------------+
  ```

  For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.
*  `asynchronous_connection_failover_delete_source()`

  Remove configuration information for a replication source server from the source list for a replication channel.

  Syntax:

  ```
  asynchronous_connection_failover_delete_source(channel, host, port, network_namespace)
  ```

  Arguments:

  + *`channel`*: The replication channel for which this replication source server was part of the source list.
  + *`host`*: The host name for this replication source server.
  + *`port`*: The port number for this replication source server.
  + *`network_namespace`*: The network namespace for this replication source server. Specify an empty string, as this parameter is reserved for future use.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT asynchronous_connection_failover_delete_source('channel2', '127.0.0.1', 3310, '');
  +------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_delete_source('channel2', '127.0.0.1', 3310, '')              |
  +------------------------------------------------------------------------------------------------+
  | Source configuration details successfully deleted.                                             |
  +------------------------------------------------------------------------------------------------+
  ```

  For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.
*  `asynchronous_connection_failover_reset()`

  Remove all settings relating to the asynchronous connection failover mechanism. The function clears the Performance Schema tables `replication_asynchronous_connection_failover` and `replication_asynchronous_connection_failover_managed`.

   `asynchronous_connection_failover_reset()` can be used only on a server that is not currently part of a group, and that does not have any replication channels running. You can use this function to clean up a server that is no longer being used in a managed group.

  Syntax:

  ```
  STRING asynchronous_connection_failover_reset()
  ```

  Arguments:

  None.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  mysql> SELECT asynchronous_connection_failover_reset();
  +-------------------------------------------------------------------------+
  | asynchronous_connection_failover_reset()                                |
  +-------------------------------------------------------------------------+
  | The UDF asynchronous_connection_failover_reset() executed successfully. |
  +-------------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.

