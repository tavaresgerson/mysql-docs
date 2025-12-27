### 17.7.2 Group Replication Status Variables

MySQL 5.7 supports one status variable providing information about Group Replication. This variable is described here:

* [`group_replication_primary_member`](server-status-variables.html#statvar_group_replication_primary_member)

  Shows the primary member's UUID when the group is operating in single-primary mode. If the group is operating in multi-primary mode, shows an empty string. See [Section 17.5.1.3, “Finding the Primary”](group-replication-find-primary.html "17.5.1.3 Finding the Primary").
