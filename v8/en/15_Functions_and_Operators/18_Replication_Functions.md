## 14.18 Replication Functions

The functions described in the following sections are used with MySQL Replication.

**Table 14.24 Replication Functions**

<table frame="box" rules="all" summary="A reference that lists functions used with MySQL Replication."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>asynchronous_connection_failover_add_managed()</code></th> <td> Add group member source server configuration information to a replication channel source list </td> <td>8.0.23</td> <td></td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_add_source()</code></th> <td> Add source server configuration information server to a replication channel source list </td> <td>8.0.22</td> <td></td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_delete_managed()</code></th> <td> Remove a managed group from a replication channel source list </td> <td>8.0.23</td> <td></td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_delete_source()</code></th> <td> Remove a source server from a replication channel source list </td> <td>8.0.22</td> <td></td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_reset()</code></th> <td> Remove all settings relating to group replication asynchronous failover </td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row"><code>group_replication_disable_member_action()</code></th> <td> Disable member action for event specified </td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row"><code>group_replication_enable_member_action()</code></th> <td> Enable member action for event specified </td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row"><code>group_replication_get_communication_protocol()</code></th> <td> Get version of group replication communication protocol currently in use </td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row"><code>group_replication_get_write_concurrency()</code></th> <td> Get maximum number of consensus instances currently set for group </td> <td>8.0.13</td> <td></td> </tr><tr><th scope="row"><code>group_replication_reset_member_actions()</code></th> <td> Reset all member actions to defaults and configuration version number to 1 </td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row"><code>group_replication_set_as_primary()</code></th> <td> Make a specific group member the primary </td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row"><code>group_replication_set_communication_protocol()</code></th> <td> Set version for group replication communication protocol to use </td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row"><code>group_replication_set_write_concurrency()</code></th> <td> Set maximum number of consensus instances that can be executed in parallel </td> <td>8.0.13</td> <td></td> </tr><tr><th scope="row"><code>group_replication_switch_to_multi_primary_mode()</code></th> <td> Changes the mode of a group running in single-primary mode to multi-primary mode </td> <td>8.0.13</td> <td></td> </tr><tr><th scope="row"><code>group_replication_switch_to_single_primary_mode()</code></th> <td> Changes the mode of a group running in multi-primary mode to single-primary mode </td> <td>8.0.13</td> <td></td> </tr><tr><th scope="row"><code>GTID_SUBSET()</code></th> <td> Return true if all GTIDs in subset are also in set; otherwise false. </td> <td></td> <td></td> </tr><tr><th scope="row"><code>GTID_SUBTRACT()</code></th> <td> Return all GTIDs in set that are not in subset. </td> <td></td> <td></td> </tr><tr><th scope="row"><code>MASTER_POS_WAIT()</code></th> <td> Block until the replica has read and applied all updates up to the specified position </td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row"><code>SOURCE_POS_WAIT()</code></th> <td> Block until the replica has read and applied all updates up to the specified position </td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row"><code>WAIT_FOR_EXECUTED_GTID_SET()</code></th> <td> Wait until the given GTIDs have executed on the replica. </td> <td></td> <td></td> </tr><tr><th scope="row"><code>WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()</code></th> <td> Use <code>WAIT_FOR_EXECUTED_GTID_SET()</code>. </td> <td></td> <td>8.0.18</td> </tr></tbody></table>


### 14.18.1 Group Replication Functions

The functions described in the following sections are used with Group Replication.

**Table 14.25 Group Replication Functions**

<table frame="box" rules="all" summary="A reference that lists functions used with MySQL Group Replication."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th scope="row"><code>group_replication_disable_member_action()</code></th> <td> Disable member action for event specified </td> <td>8.0.26</td> </tr><tr><th scope="row"><code>group_replication_enable_member_action()</code></th> <td> Enable member action for event specified </td> <td>8.0.26</td> </tr><tr><th scope="row"><code>group_replication_get_communication_protocol()</code></th> <td> Get version of group replication communication protocol currently in use </td> <td>8.0.16</td> </tr><tr><th scope="row"><code>group_replication_get_write_concurrency()</code></th> <td> Get maximum number of consensus instances currently set for group </td> <td>8.0.13</td> </tr><tr><th scope="row"><code>group_replication_reset_member_actions()</code></th> <td> Reset all member actions to defaults and configuration version number to 1 </td> <td>8.0.26</td> </tr><tr><th scope="row"><code>group_replication_set_as_primary()</code></th> <td> Make a specific group member the primary </td> <td>8.0.29</td> </tr><tr><th scope="row"><code>group_replication_set_communication_protocol()</code></th> <td> Set version for group replication communication protocol to use </td> <td>8.0.16</td> </tr><tr><th scope="row"><code>group_replication_set_write_concurrency()</code></th> <td> Set maximum number of consensus instances that can be executed in parallel </td> <td>8.0.13</td> </tr><tr><th scope="row"><code>group_replication_switch_to_multi_primary_mode()</code></th> <td> Changes the mode of a group running in single-primary mode to multi-primary mode </td> <td>8.0.13</td> </tr><tr><th scope="row"><code>group_replication_switch_to_single_primary_mode()</code></th> <td> Changes the mode of a group running in multi-primary mode to single-primary mode </td> <td>8.0.13</td> </tr></tbody></table>


#### 14.18.1.1 Function which Configures Group Replication Primary

The following function enables you to set a member of a single-primary replication group to take over as the primary. The current primary becomes a read-only secondary, and the specified group member becomes the read-write primary. The function can be used on any member of a replication group running in single-primary mode. This function replaces the usual primary election process; see Section 20.5.1.1, “Changing the Primary”, for more information.

If a standard source to replica replication channel is running on the existing primary member in addition to the Group Replication channels, you must stop that replication channel before you can change the primary member. You can identify the current primary using the `MEMBER_ROLE` column in the Performance Schema table `replication_group_members`, or the `group_replication_primary_member` status variable.

Any uncommitted transactions that the group is waiting on must be committed, rolled back, or terminated before the operation can complete. Before MySQL 8.0.29, the function waits for all active transactions on the existing primary to end, including incoming transactions that are started after the function is used. From MySQL 8.0.29, you can specify a timeout for transactions that are running when you use the function. For the timeout to work, all members of the group must be at MySQL 8.0.29 or higher.

When the timeout expires, for any transactions that did not yet reach their commit phase, the client session is disconnected so that the transaction does not proceed. Transactions that reached their commit phase are allowed to complete. When you set a timeout, it also prevents new transactions starting on the primary from that point on. Explicitly defined transactions (with a `START TRANSACTION` or `BEGIN` statement) are subject to the timeout, disconnection, and incoming transaction blocking even if they do not modify any data. To allow inspection of the primary while the function is operating, single statements that do not modify data, as listed in Permitted Queries Under Consistency Rules, are permitted to proceed.

* `group_replication_set_as_primary()`

  Appoints a specific member of the group as the new primary, overriding any election process.

  Syntax:

  ```
  STRING group_replication_set_as_primary(member_uuid[, timeout])
  ```

  Arguments:

  + *`member_uuid`*: A string containing the UUID of the member of the group that you want to become the new primary.

  + *`timeout`*: An integer specifying a timeout in seconds for transactions that are running on the existing primary when you use the function. You can set a timeout from 0 seconds (immediately) up to 3600 seconds (60 minutes). When you set a timeout, new transactions cannot start on the primary from that point on. There is no default setting for the timeout, so if you do not set it, there is no upper limit to the wait time, and new transactions can start during that time. This option is available from MySQL 8.0.29.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT group_replication_set_as_primary(‘00371d66-3c45-11ea-804b-080027337932’, 300);
  ```

  For more information, see Section 20.5.1.1, “Changing the Primary”.


#### 14.18.1.2 Functions which Configure the Group Replication Mode

The following functions enable you to control the mode which a replication group is running in, either single-primary or multi-primary mode.

* `group_replication_switch_to_multi_primary_mode()`

  Changes a group running in single-primary mode to multi-primary mode. Must be issued on a member of a replication group running in single-primary mode.

  Syntax:

  ```
  STRING group_replication_switch_to_multi_primary_mode()
  ```

  This function has no parameters.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT group_replication_switch_to_multi_primary_mode()
  ```

  All members which belong to the group become primaries.

  For more information, see Section 20.5.1.2, “Changing the Group Mode”

* `group_replication_switch_to_single_primary_mode()`

  Changes a group running in multi-primary mode to single-primary mode, without the need to stop Group Replication. Must be issued on a member of a replication group running in multi-primary mode. When you change to single-primary mode, strict consistency checks are also disabled on all group members, as required in single-primary mode (`group_replication_enforce_update_everywhere_checks=OFF`).

  Syntax:

  ```
  STRING group_replication_switch_to_single_primary_mode([str])
  ```

  Arguments:

  + *`str`*: A string containing the UUID of a member of the group which should become the new single primary. Other members of the group become secondaries.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT group_replication_switch_to_single_primary_mode(member_uuid);
  ```

  For more information, see Section 20.5.1.2, “Changing the Group Mode”


#### 14.18.1.3 Functions to Inspect and Configure the Maximum Consensus Instances of a Group

The following functions enable you to inspect and configure the maximum number of consensus instances that a group can execute in parallel.

* `group_replication_get_write_concurrency()`

  Check the maximum number of consensus instances that a group can execute in parallel.

  Syntax:

  ```
  INT group_replication_get_write_concurrency()
  ```

  This function has no parameters.

  Return value:

  The maximum number of consensus instances currently set for the group.

  Example:

  ```
  SELECT group_replication_get_write_concurrency()
  ```

  For more information, see Section 20.5.1.3, “Using Group Replication Group Write Consensus”.

* `group_replication_set_write_concurrency()`

  Configures the maximum number of consensus instances that a group can execute in parallel. The `GROUP_REPLICATION_ADMIN` privilege is required to use this function.

  Syntax:

  ```
  STRING group_replication_set_write_concurrency(instances)
  ```

  Arguments:

  + *`members`*: Sets the maximum number of consensus instances that a group can execute in parallel. Default value is 10, valid values are integers in the range of 10 to 200.

  Return value:

  Any resulting error as a string.

  Example:

  ```
  SELECT group_replication_set_write_concurrency(instances);
  ```

  For more information, see Section 20.5.1.3, “Using Group Replication Group Write Consensus”.


#### 14.18.1.4 Functions to Inspect and Set the Group Replication Communication Protocol Version

The following functions enable you to inspect and configure the Group Replication communication protocol version that is used by a replication group.

* Versions from MySQL 5.7.14 allow compression of messages (see Section 20.7.4, “Message Compression”).

* Versions from MySQL 8.0.16 also allow fragmentation of messages (see Section 20.7.5, “Message Fragmentation”).

* Versions from MySQL 8.0.27 also allow the group communication engine to operate with a single consensus leader when the group is in single-primary mode and `group_replication_paxos_single_leader` is set to true (see Section 20.7.3, “Single Consensus Leader”).

* `group_replication_get_communication_protocol()`

  Inspect the Group Replication communication protocol version that is currently in use for a group.

  Syntax:

  ```
  STRING group_replication_get_communication_protocol()
  ```

  This function has no parameters.

  Return value:

  The oldest MySQL Server version that can join this group and use the group's communication protocol. Note that the `group_replication_get_communication_protocol()` function returns the minimum MySQL version that the group supports, which might differ from the version number that was passed to `group_replication_set_communication_protocol()`, and from the MySQL Server version that is installed on the member where you use the function.

  If the protocol cannot be inspected because this server instance does not belong to a replication group, an error is returned as a string.

  Example:

  ```
  SELECT group_replication_get_communication_protocol();
  +------------------------------------------------+
  | group_replication_get_communication_protocol() |
  +------------------------------------------------+
  | 8.0.44                                          |
  +------------------------------------------------+
  ```

  For more information, see Section 20.5.1.4, “Setting a Group's Communication Protocol Version”.

* `group_replication_set_communication_protocol()`

  Downgrade the Group Replication communication protocol version of a group so that members at earlier releases can join, or upgrade the Group Replication communication protocol version of a group after upgrading MySQL Server on all members. The `GROUP_REPLICATION_ADMIN` privilege is required to use this function, and all existing group members must be online when you issue the statement, with no loss of majority.

  Note

  For MySQL InnoDB cluster, the communication protocol version is managed automatically whenever the cluster topology is changed using AdminAPI operations. You do not have to use these functions yourself for an InnoDB cluster.

  Syntax:

  ```
  STRING group_replication_set_communication_protocol(version)
  ```

  Arguments:

  + *`version`*: For a downgrade, specify the MySQL Server version of the prospective group member that has the oldest installed server version. In this case, the command makes the group fall back to a communication protocol compatible with that server version if possible. The minimum server version that you can specify is MySQL 5.7.14. For an upgrade, specify the new MySQL Server version to which the existing group members have been upgraded.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT group_replication_set_communication_protocol("5.7.25");
  ```

  For more information, see Section 20.5.1.4, “Setting a Group's Communication Protocol Version”.


#### 14.18.1.5 Functions to Set and Reset Group Replication Member Actions

The following functions can be used to enable and disable actions for members of a group to take in specified situations, and to reset the configuration to the default setting for all member actions. They can only be used by administrators with the `GROUP_REPLICATION_ADMIN` privilege or the deprecated `SUPER` privilege.

You configure member actions on the group’s primary using the `group_replication_enable_member_action` and `group_replication_disable_member_action` functions. The member actions configuration, consisting of all the member actions and whether they are enabled or disabled, is then propagated to other group members and joining members using Group Replication’s group messages. This means that the group members will all act in the same way when they are in the specified situation, and you only need to use the function on the primary.

The functions can also be used on a server that is not part of a group, as long as the Group Replication plugin is installed. In that case, the member actions configuration is not propagated to any other servers.

The `group_replication_reset_member_actions` function can only be used on a server that is not part of a group. It resets the member actions configuration to the default settings, and resets its version number. The server must be writeable (with the `read_only` system variable set to `OFF`) and have the Group Replication plugin installed.

The available member actions are as follows:

`mysql_disable_super_read_only_if_primary` :   This member action is available from MySQL 8.0.26. It is taken after a member is elected as the group’s primary, which is the event `AFTER_PRIMARY_ELECTION`. The member action is enabled by default. You can disable it using the `group_replication_disable_member_action()` function, and re-enable it using `group_replication_enable_member_action()`.

    When this member action is enabled and taken, super read-only mode is disabled on the primary, so that the primary becomes read-write and accepts updates from a replication source server and from clients. This is the normal situation.

    When this member action is disabled and not taken, the primary remains in super read-only mode after election. In this state, it does not accept updates from any clients, even users who have the `CONNECTION_ADMIN` or `SUPER` privilege. It does continue to accept updates performed by replication threads. This setup means that when a group’s purpose is to provide a secondary backup to another group for disaster tolerance, you can ensure that the secondary group remains synchronized with the first.

`mysql_start_failover_channels_if_primary` :   This member action is available from MySQL 8.0.27. It is taken after a member is elected as the group’s primary, which is the event `AFTER_PRIMARY_ELECTION`. The member action is enabled by default. You can disable it using the `group_replication_disable_member_action()` function, and re-enable it using the `group_replication_enable_member_action()` function.

    When this member action is enabled, asynchronous connection failover for replicas is active for a replication channel on a Group Replication primary when you set `SOURCE_CONNECTION_AUTO_FAILOVER=1` in the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") statement for the channel. When the feature is active and correctly configured, if the primary that is replicating goes offline or into an error state, the new primary starts replication on the same channel when it is elected. This is the normal situation. For instructions to configure the feature, see Section 19.4.9.2, “Asynchronous Connection Failover for Replicas”.

    When this member action is disabled, asynchronous connection failover does not take place for the replicas. If the primary goes offline or into an error state, replication stops for the channel. Note that if there is more than one channel with `SOURCE_CONNECTION_AUTO_FAILOVER=1`, the member action covers all the channels, so they cannot be individually enabled and disabled by this method. Set `SOURCE_CONNECTION_AUTO_FAILOVER=0` to disable an individual channel.

For more information on member actions and how to view the member actions configuration, see Section 20.5.1.5, “Configuring Member Actions”.

* `group_replication_disable_member_action()`

  Disable a member action so that the member does not take it in the specified situation. If the server where you use the function is part of a group, it must be the current primary in a group in single-primary mode, and it must be part of the majority. The changed setting is propagated to other group members and joining members, so they will all act in the same way when they are in the specified situation, and you only need to use the function on the primary.

  Syntax:

  ```
  STRING group_replication_disable_member_action(name, event)
  ```

  Arguments:

  + *`name`*: The name of the member action to disable.

  + *`event`*: The event that triggers the member action.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT group_replication_disable_member_action("mysql_disable_super_read_only_if_primary", "AFTER_PRIMARY_ELECTION");
  ```

  For more information, see Section 20.5.1.5, “Configuring Member Actions”.

* `group_replication_enable_member_action()`

  Enable a member action for the member to take in the specified situation. If the server where you use the function is part of a group, it must be the current primary in a group in single-primary mode, and it must be part of the majority. The changed setting is propagated to other group members and joining members, so they will all act in the same way when they are in the specified situation, and you only need to use the function on the primary.

  Syntax:

  ```
  STRING group_replication_enable_member_action(name, event)
  ```

  Arguments:

  + *`name`*: The name of the member action to enable.

  + *`event`*: The event that triggers the member action.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT group_replication_enable_member_action("mysql_disable_super_read_only_if_primary", "AFTER_PRIMARY_ELECTION");
  ```

  For more information, see Section 20.5.1.5, “Configuring Member Actions”.

* `group_replication_reset_member_actions()`

  Reset the member actions configuration to the default settings, and reset its version number to 1.

  The `group_replication_reset_member_actions()` function can only be used on a server that is not currently part of a group. The server must be writeable (with the `read_only` system variable set to `OFF`) and have the Group Replication plugin installed. You can use this function to remove the member actions configuration that a server used when it was part of a group, if you intend to use it as a standalone server with no member actions or different member actions.

  Syntax:

  ```
  STRING group_replication_reset_member_actions()
  ```

  Arguments:

  None.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT group_replication_reset_member_actions();
  ```

  For more information, see Section 20.5.1.5, “Configuring Member Actions”.


### 14.18.2 Functions Used with Global Transaction Identifiers (GTIDs)

The functions described in this section are used with GTID-based replication. It is important to keep in mind that all of these functions take string representations of GTID sets as arguments. As such, the GTID sets must always be quoted when used with them. See GTID Sets for more information.

The union of two GTID sets is simply their representations as strings, joined together with an interposed comma. In other words, you can define a very simple function for obtaining the union of two GTID sets, similar to that created here:

```
CREATE FUNCTION GTID_UNION(g1 TEXT, g2 TEXT)
    RETURNS TEXT DETERMINISTIC
    RETURN CONCAT(g1,',',g2);
```

For more information about GTIDs and how these GTID functions are used in practice, see Section 19.1.3, “Replication with Global Transaction Identifiers”.

**Table 14.26 GTID Functions**

<table frame="box" rules="all" summary="A reference that lists functions used with global transaction identifiers (GTIDs)."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>GTID_SUBSET()</code></th> <td> Return true if all GTIDs in subset are also in set; otherwise false. </td> <td></td> </tr><tr><th scope="row"><code>GTID_SUBTRACT()</code></th> <td> Return all GTIDs in set that are not in subset. </td> <td></td> </tr><tr><th scope="row"><code>WAIT_FOR_EXECUTED_GTID_SET()</code></th> <td> Wait until the given GTIDs have executed on the replica. </td> <td></td> </tr><tr><th scope="row"><code>WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()</code></th> <td> Use <code>WAIT_FOR_EXECUTED_GTID_SET()</code>. </td> <td>8.0.18</td> </tr></tbody></table>

* `GTID_SUBSET(set1,set2)`

  Given two sets of global transaction identifiers *`set1`* and *`set2`*, returns true if all GTIDs in *`set1`* are also in *`set2`*. Returns `NULL` if *`set1`* or *`set2`* is `NULL`. Returns false otherwise.

  The GTID sets used with this function are represented as strings, as shown in the following examples:

  ```
  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 1
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23-25',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23-25',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 1
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 0
  1 row in set (0.00 sec)
  ```

* `GTID_SUBTRACT(set1,set2)`

  Given two sets of global transaction identifiers *`set1`* and *`set2`*, returns only those GTIDs from *`set1`* that are not in *`set2`*. Returns `NULL` if *`set1`* or *`set2`* is `NULL`.

  All GTID sets used with this function are represented as strings and must be quoted, as shown in these examples:

  ```
  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:22-57
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:26-57
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:23-24')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:23-24'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:21-22:25-57
  1 row in set (0.01 sec)
  ```

  Subtracting a GTID set from itself produces an empty set, as shown here:

  ```
  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'):
  1 row in set (0.00 sec)
  ```

* [`WAIT_FOR_EXECUTED_GTID_SET(gtid_set[, timeout])`](gtid-functions.html#function_wait-for-executed-gtid-set)

  Wait until the server has applied all of the transactions whose global transaction identifiers are contained in *`gtid_set`*; that is, until the condition GTID_SUBSET(*`gtid_subset`*, `@@GLOBAL.gtid_executed`) holds. See Section 19.1.3.1, “GTID Format and Storage” for a definition of GTID sets.

  If a timeout is specified, and *`timeout`* seconds elapse before all of the transactions in the GTID set have been applied, the function stops waiting. *`timeout`* is optional, and the default timeout is 0 seconds, in which case the function always waits until all of the transactions in the GTID set have been applied. *`timeout`* must be greater than or equal to 0; when running in strict SQL mode, a negative *`timeout`* value is immediately rejected with an error (`ER_WRONG_ARGUMENTS`); otherwise the function returns `NULL`, and raises a warning.

  `WAIT_FOR_EXECUTED_GTID_SET()` monitors all the GTIDs that are applied on the server, including transactions that arrive from all replication channels and user clients. It does not take into account whether replication channels have been started or stopped.

  For more information, see Section 19.1.3, “Replication with Global Transaction Identifiers”.

  GTID sets used with this function are represented as strings and so must be quoted as shown in the following example:

  ```
  mysql> SELECT WAIT_FOR_EXECUTED_GTID_SET('3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5');
          -> 0
  ```

  For a syntax description for GTID sets, see Section 19.1.3.1, “GTID Format and Storage”.

  For `WAIT_FOR_EXECUTED_GTID_SET()`, the return value is the state of the query, where 0 represents success, and 1 represents timeout. Any other failures generate an error.

  `gtid_mode` cannot be changed to OFF while any client is using this function to wait for GTIDs to be applied.

* [`WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS(gtid_set[, timeout][,channel])`](gtid-functions.html#function_wait-until-sql-thread-after-gtids)

  `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` is deprecated. Use `WAIT_FOR_EXECUTED_GTID_SET()` instead, which works regardless of the replication channel or user client through which the specified transactions arrive on the server.


### 14.18.3 Asynchronous Replication Channel Failover Functions

The following functions, which are available from MySQL 8.0.22 for standard source to replica replication and from MySQL 8.0.23 for Group Replication, enable you to add and remove replication source servers from the source list for a replication channel. From MySQL 8.0.27, you can also clear the source list for a server.

**Table 14.27 Failover Channel Functions**

<table frame="box" rules="all" summary="A reference that lists functions used for controlling asynchronous failover for a given channel or server."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th scope="row"><code>asynchronous_connection_failover_add_managed()</code></th> <td> Add group member source server configuration information to a replication channel source list </td> <td>8.0.23</td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_add_source()</code></th> <td> Add source server configuration information server to a replication channel source list </td> <td>8.0.22</td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_delete_managed()</code></th> <td> Remove a managed group from a replication channel source list </td> <td>8.0.23</td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_delete_source()</code></th> <td> Remove a source server from a replication channel source list </td> <td>8.0.22</td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_reset()</code></th> <td> Remove all settings relating to group replication asynchronous failover </td> <td>8.0.27</td> </tr></tbody></table>

The asynchronous connection failover mechanism automatically establishes an asynchronous (source to replica) replication connection to a new source from the appropriate list after the existing connection from the replica to its source fails. From MySQL 8.0.23, the connection is also changed if the currently connected source does not have the highest weighted priority in the group. For Group Replication source servers that are defined as part of a managed group, the connection is also failed over to another group member if the currently connected source leaves the group or is no longer in the majority. For more information on the mechanism, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.

Source lists are stored in the `mysql.replication_asynchronous_connection_failover` and `mysql.replication_asynchronous_connection_failover_managed` tables, and can be viewed in the Performance Schema `replication_asynchronous_connection_failover` table.

If the replication channel is on a Group Replication primary for a group where failover between replicas is active, the source list is broadcast to all the group members when they join or when it is updated by any method. Failover between replicas is controlled by the `mysql_start_failover_channels_if_primary` member action, which is enabled by default, and can be disabled using the `group_replication_disable_member_action` function.

* `asynchronous_connection_failover_add_managed()`

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

* `asynchronous_connection_failover_add_source()`

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

  + *`weight`*: The priority of this replication source server in the replication channel's source list. The priority is from 1 to 100, with 100 being the highest, and 50 being the default. When the asynchronous connection failover mechanism activates, the source with the highest priority setting among the alternative sources listed in the source list for the channel is chosen for the first connection attempt. If this attempt does not work, the replica tries with all the listed sources in descending order of priority, then starts again from the highest priority source. If multiple sources have the same priority, the replica orders them randomly. From MySQL 8.0.23, the asynchronous connection failover mechanism activates if the source currently connected is not the highest weighted in the group.

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

* `asynchronous_connection_failover_delete_managed()`

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

* `asynchronous_connection_failover_delete_source()`

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

* `asynchronous_connection_failover_reset()`

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


### 14.18.4 Position-Based Synchronization Functions

The functions listed in this section are used for controlling position-based synchronization of source and replica servers in MySQL Replication.

**Table 14.28 Positional Synchronization Functions**

<table frame="box" rules="all" summary="A reference that lists functions used with position-based synchronization of replication source and replica servers."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>MASTER_POS_WAIT()</code></th> <td> Block until the replica has read and applied all updates up to the specified position </td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row"><code>SOURCE_POS_WAIT()</code></th> <td> Block until the replica has read and applied all updates up to the specified position </td> <td>8.0.26</td> <td></td> </tr></tbody></table>

* `MASTER_POS_WAIT(log_name,log_pos[,timeout][,channel])`

  This function is for control of source-replica synchronization. It blocks until the replica has read and applied all updates up to the specified position in the source's binary log. From MySQL 8.0.26, `MASTER_POS_WAIT()` is deprecated and the alias `SOURCE_POS_WAIT()` should be used instead. In releases before MySQL 8.0.26, use `MASTER_POS_WAIT()`.

  The return value is the number of log events the replica had to wait for to advance to the specified position. The function returns `NULL` if the replication SQL thread is not started, the replica's source information is not initialized, the arguments are incorrect, or an error occurs. It returns `-1` if the timeout has been exceeded. If the replication SQL thread stops while `MASTER_POS_WAIT()` is waiting, the function returns `NULL`. If the replica is past the specified position, the function returns immediately.

  If the binary log file position has been marked as invalid, the function waits until a valid file position is known. The binary log file position can be marked as invalid when the `CHANGE REPLICATION SOURCE TO` option `GTID_ONLY` is set for the replication channel, and the server is restarted or replication is stopped. The file position becomes valid after a transaction is successfully applied past the given file position. If the applier does not reach the stated position, the function waits until the timeout. Use a `SHOW REPLICA STATUS` statement to check if the binary log file position has been marked as invalid.

  On a multithreaded replica, the function waits until expiry of the limit set by the `replica_checkpoint_group`, `slave_checkpoint_group`, `replica_checkpoint_period` or `slave_checkpoint_period` system variable, when the checkpoint operation is called to update the status of the replica. Depending on the setting for the system variables, the function might therefore return some time after the specified position was reached.

  If binary log transaction compression is in use and the transaction payload at the specified position is compressed (as a `Transaction_payload_event`), the function waits until the whole transaction has been read and applied, and the positions have updated.

  If a *`timeout`* value is specified, `MASTER_POS_WAIT()` stops waiting when *`timeout`* seconds have elapsed. *`timeout`* must be greater than or equal to 0. (When the server is running in strict SQL mode, a negative *`timeout`* value is immediately rejected with `ER_WRONG_ARGUMENTS`; otherwise the function returns **`NULL`**, and raises a warning.)

  The optional *`channel`* value enables you to name which replication channel the function applies to. See Section 19.2.2, “Replication Channels” for more information.

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.

* `SOURCE_POS_WAIT(log_name,log_pos[,timeout][,channel])`

  This function is for control of source-replica synchronization. It blocks until the replica has read and applied all updates up to the specified position in the source's binary log. From MySQL 8.0.26, use `SOURCE_POS_WAIT()` in place of `MASTER_POS_WAIT()`, which is deprecated from that release. In releases before MySQL 8.0.26, use `MASTER_POS_WAIT()`.

  The return value is the number of log events the replica had to wait for to advance to the specified position. The function returns `NULL` if the replication SQL thread is not started, the replica's source information is not initialized, the arguments are incorrect, or an error occurs. It returns `-1` if the timeout has been exceeded. If the replication SQL thread stops while `SOURCE_POS_WAIT()` is waiting, the function returns `NULL`. If the replica is past the specified position, the function returns immediately.

  If the binary log file position has been marked as invalid, the function waits until a valid file position is known. The binary log file position can be marked as invalid when the `CHANGE REPLICATION SOURCE TO` option `GTID_ONLY` is set for the replication channel, and the server is restarted or replication is stopped. The file position becomes valid after a transaction is successfully applied past the given file position. If the applier does not reach the stated position, the function waits until the timeout. Use a `SHOW REPLICA STATUS` statement to check if the binary log file position has been marked as invalid.

  On a multithreaded replica, the function waits until expiry of the limit set by the `replica_checkpoint_group` or `replica_checkpoint_period` system variable, when the checkpoint operation is called to update the status of the replica. Depending on the setting for the system variables, the function might therefore return some time after the specified position was reached.

  If binary log transaction compression is in use and the transaction payload at the specified position is compressed (as a `Transaction_payload_event`), the function waits until the whole transaction has been read and applied, and the positions have updated.

  If a *`timeout`* value is specified, `SOURCE_POS_WAIT()` stops waiting when *`timeout`* seconds have elapsed. *`timeout`* must be greater than or equal to 0. (In strict SQL mode, a negative *`timeout`* value is immediately rejected with `ER_WRONG_ARGUMENTS`; otherwise the function returns `NULL`, and raises a warning.)

  The optional *`channel`* value enables you to name which replication channel the function applies to. See Section 19.2.2, “Replication Channels” for more information.

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.
