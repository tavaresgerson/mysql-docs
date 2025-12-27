#### 25.12.11.7 The replication\_group\_member\_stats Table

This table shows statistical information for MySQL Group Replication members. It is populated only when Group Replication is running.

The `replication_group_member_stats` table has these columns:

* `CHANNEL_NAME`

  Name of the Group Replication channel.

* `VIEW_ID`

  Current view identifier for this group.

* `MEMBER_ID`

  The member server UUID. This has a different value for each member in the group. This also serves as a key because it is unique to each member.

* `COUNT_TRANSACTIONS_IN_QUEUE`

  The number of transactions in the queue pending conflict detection checks. Once the transactions have been checked for conflicts, if they pass the check, they are queued to be applied as well.

* `COUNT_TRANSACTIONS_CHECKED`

  The number of transactions that have been checked for conflicts.

* `COUNT_CONFLICTS_DETECTED`

  The number of transactions that have not passed the conflict detection check.

* `COUNT_TRANSACTIONS_ROWS_VALIDATING`

  Number of transaction rows which can be used for certification, but have not been garbage collected. Can be thought of as the current size of the conflict detection database against which each transaction is certified.

* `TRANSACTIONS_COMMITTED_ALL_MEMBERS`

  The transactions that have been successfully committed on all members of the replication group, shown as [GTID Sets](replication-gtids-concepts.html#replication-gtids-concepts-gtid-sets "GTID Sets"). This is updated at a fixed time interval.

* `LAST_CONFLICT_FREE_TRANSACTION`

  The transaction identifier of the last conflict free transaction which was checked.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`replication_group_member_stats`](performance-schema-replication-group-member-stats-table.html "25.12.11.7 The replication_group_member_stats Table") table.
