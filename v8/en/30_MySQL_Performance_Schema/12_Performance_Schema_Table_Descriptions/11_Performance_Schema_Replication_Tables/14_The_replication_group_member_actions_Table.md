#### 29.12.11.14 The replication_group_member_actions Table

This table lists the member actions that are included in the member actions configuration for replication group members. The table is available only when Group Replication is installed. You can reset the member actions configuration using the `group_replication_reset_member_actions()` function. For more information, see Section 20.5.1.5, “Configuring Member Actions”.

The `replication_group_member_actions` table has these columns:

* `NAME`

  The name of the member action.

* `EVENT`

  The event that triggers the member action.

* `ENABLED`

  Whether the member action is currently enabled. Member actions can be enabled using the `group_replication_enable_member_action()` function and disabled using the `group_replication_disable_member_action()` function.

* `TYPE`

  The type of member action. `INTERNAL` is an action that is provided by the Group Replication plugin.

* `PRIORITY`

  The priority of the member action. Actions with lower priority values are actioned first.

* `ERROR_HANDLING`

  The action that Group Replication takes if an error occurs when the member action is being carried out. `IGNORE` means that an error message is logged to say that the member action failed, but no further action is taken. `CRITICAL` means that the member moves into `ERROR` state, and takes the action specified by the `group_replication_exit_state_action` system variable.

The `replication_group_member_actions` table has no indexes.

`TRUNCATE TABLE` is not permitted for the `replication_group_member_actions` table.
