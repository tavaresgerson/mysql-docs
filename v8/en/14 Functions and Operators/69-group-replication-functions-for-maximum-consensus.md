#### 14.18.1.3 Functions to Inspect and Configure the Maximum Consensus Instances of a Group

The following functions enable you to inspect and configure the maximum number of consensus instances that a group can execute in parallel.

*  `group_replication_get_write_concurrency()`

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
*  `group_replication_set_write_concurrency()`

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

