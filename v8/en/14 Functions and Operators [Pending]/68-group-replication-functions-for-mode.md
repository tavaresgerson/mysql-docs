--- title: MySQL 8.4 Reference Manual :: 14.18.1.2 Functions which Configure the Group Replication Mode url: https://dev.mysql.com/doc/refman/8.4/en/group-replication-functions-for-mode.html order: 68 ---



#### 14.18.1.2 Functions which Configure the Group Replication Mode

The following functions enable you to control the mode which a replication group is running in, either single-primary or multi-primary mode.

*  `group_replication_switch_to_multi_primary_mode()`

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
*  `group_replication_switch_to_single_primary_mode()`

  Changes a group running in multi-primary mode to single-primary mode, without the need to stop Group Replication. Must be issued on a member of a replication group running in multi-primary mode. When you change to single-primary mode, strict consistency checks are also disabled on all group members, as required in single-primary mode ( `group_replication_enforce_update_everywhere_checks=OFF`).

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

