--- title: MySQL 8.4 Reference Manual :: 14.18.1.4 Functions to Inspect and Set the Group Replication Communication Protocol Version url: https://dev.mysql.com/doc/refman/8.4/en/group-replication-functions-for-communication-protocol.html order: 70 ---



#### 14.18.1.4 Functions to Inspect and Set the Group Replication Communication Protocol Version

The following functions enable you to inspect and configure the Group Replication communication protocol version that is used by a replication group.

*  Section 20.7.4, “Message Compression”
*  Section 20.7.5, “Message Fragmentation”
*  Section 20.7.3, “Single Consensus Leader”

*  `group_replication_get_communication_protocol()`

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
  | 8.4.6                                          |
  +------------------------------------------------+
  ```

  For more information, see Section 20.5.1.4, “Setting a Group's Communication Protocol Version”.
*  `group_replication_set_communication_protocol()`

  Downgrade the Group Replication communication protocol version of a group so that members at earlier releases can join, or upgrade the Group Replication communication protocol version of a group after upgrading MySQL Server on all members. The `GROUP_REPLICATION_ADMIN` privilege is required to use this function, and all existing group members must be online when you issue the statement, with no loss of majority.

  ::: info Note

  For MySQL InnoDB cluster, the communication protocol version is managed automatically whenever the cluster topology is changed using AdminAPI operations. You do not have to use these functions yourself for an InnoDB cluster.


  :::

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

