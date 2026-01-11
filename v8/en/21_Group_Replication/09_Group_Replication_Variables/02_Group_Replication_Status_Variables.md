### 20.9.2 Group Replication Status Variables

MySQL 8.0 supports one status variable providing information about Group Replication. This variable is described here:

* `group_replication_primary_member`

  Shows the primary member's UUID when the group is operating in single-primary mode. If the group is operating in multi-primary mode, this is an empty string.

  Warning

  The `group_replication_primary_member` status variable has been deprecated and is scheduled to be removed in a future version.

  See Section 20.1.3.1.2, “Finding the Primary”.
