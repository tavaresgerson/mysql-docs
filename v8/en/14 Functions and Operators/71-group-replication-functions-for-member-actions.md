#### 14.18.1.5 Functions to Set and Reset Group Replication Member Actions

The following functions can be used to enable and disable actions for members of a group to take in specified situations, and to reset the configuration to the default setting for all member actions. They can only be used by administrators with the `GROUP_REPLICATION_ADMIN` privilege or the deprecated `SUPER` privilege.

You configure member actions on the group’s primary using the `group_replication_enable_member_action` and `group_replication_disable_member_action` functions. The member actions configuration, consisting of all the member actions and whether they are enabled or disabled, is then propagated to other group members and joining members using Group Replication’s group messages. This means that the group members will all act in the same way when they are in the specified situation, and you only need to use the function on the primary.

The functions can also be used on a server that is not part of a group, as long as the Group Replication plugin is installed. In that case, the member actions configuration is not propagated to any other servers.

The `group_replication_reset_member_actions` function can only be used on a server that is not part of a group. It resets the member actions configuration to the default settings, and resets its version number. The server must be writeable (with the `read_only` system variable set to `OFF`) and have the Group Replication plugin installed.

The available member actions are as follows:

`mysql_disable_super_read_only_if_primary` :   This member action is taken after a member is elected as the group’s primary, which is the event `AFTER_PRIMARY_ELECTION`. The member action is enabled by default. You can disable it using the `group_replication_disable_member_action()` function, and re-enable it using `group_replication_enable_member_action()`.

    When this member action is enabled and taken, super read-only mode is disabled on the primary, so that the primary becomes read-write and accepts updates from a replication source server and from clients. This is the normal situation.

    When this member action is disabled and not taken, the primary remains in super read-only mode after election. In this state, it does not accept updates from any clients, even users who have the `CONNECTION_ADMIN` or `SUPER` privilege. It does continue to accept updates performed by replication threads. This setup means that when a group’s purpose is to provide a secondary backup to another group for disaster tolerance, you can ensure that the secondary group remains synchronized with the first.

`mysql_start_failover_channels_if_primary` :   This member action is taken after a member is elected as the group’s primary, which is the event `AFTER_PRIMARY_ELECTION`. The member action is enabled by default. You can disable it using the `group_replication_disable_member_action()` function, and re-enable it using the `group_replication_enable_member_action()` function.

    When this member action is enabled, asynchronous connection failover for replicas is active for a replication channel on a Group Replication primary when you set `SOURCE_CONNECTION_AUTO_FAILOVER=1` in the `CHANGE REPLICATION SOURCE TO` statement for the channel. When the feature is active and correctly configured, if the primary that is replicating goes offline or into an error state, the new primary starts replication on the same channel when it is elected. This is the normal situation. For instructions to configure the feature, see Section 19.4.9.2, “Asynchronous Connection Failover for Replicas”.

    When this member action is disabled, asynchronous connection failover does not take place for the replicas. If the primary goes offline or into an error state, replication stops for the channel. Note that if there is more than one channel with `SOURCE_CONNECTION_AUTO_FAILOVER=1`, the member action covers all the channels, so they cannot be individually enabled and disabled by this method. Set `SOURCE_CONNECTION_AUTO_FAILOVER=0` to disable an individual channel.

For more information on member actions and how to view the member actions configuration, see Section 20.5.1.5, “Configuring Member Actions”.

*  `group_replication_disable_member_action()`

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
*  `group_replication_enable_member_action()`

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
*  `group_replication_reset_member_actions()`

  Reset the member actions configuration to the default settings, and reset its version number to 1.

  The `group_replication_reset_member_actions()` function can only be used on a server that is not currently part of a group. The server must be writeable (with the  `read_only` system variable set to `OFF`) and have the Group Replication plugin installed. You can use this function to remove the member actions configuration that a server used when it was part of a group, if you intend to use it as a standalone server with no member actions or different member actions.

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

