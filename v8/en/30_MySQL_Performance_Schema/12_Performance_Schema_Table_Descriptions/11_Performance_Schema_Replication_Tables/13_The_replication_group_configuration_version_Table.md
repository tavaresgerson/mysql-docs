#### 29.12.11.13 The replication_group_configuration_version Table

This table displays the version of the member actions configuration for replication group members. The table is available only when Group Replication is installed. Whenever a member action is enabled or disabled using the `group_replication_enable_member_action()` and `group_replication_disable_member_action()` functions, the version number is incremented. You can reset the member actions configuration using the `group_replication_reset_member_actions()` function, which resets the member actions configuration to the default settings, and resets its version number to 1. For more information, see Section 20.5.1.5, “Configuring Member Actions”.

The `replication_group_configuration_version` table has these columns:

* `NAME`

  The name of the configuration.

* `VERSION`

  The version number of the configuration.

The `replication_group_configuration_version` table has no indexes.

`TRUNCATE TABLE` is not permitted for the `replication_group_configuration_version` table.
