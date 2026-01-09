#### 29.12.11.17 The replication_group_member_stats Table

This table shows statistical information for replication group members. It is populated only when Group Replication is running.

The `replication_group_member_stats` table has these columns:

* `CHANNEL_NAME`

  Name of the Group Replication channel

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

  The transactions that have been successfully committed on all members of the replication group, shown as GTID Sets. This is updated at a fixed time interval.

* `LAST_CONFLICT_FREE_TRANSACTION`

  The transaction identifier of the last conflict free transaction which was checked.

* `COUNT_TRANSACTIONS_REMOTE_IN_APPLIER_QUEUE`

  The number of transactions that this member has received from the replication group which are waiting to be applied.

* `COUNT_TRANSACTIONS_REMOTE_APPLIED`

  Number of transactions this member has received from the group and applied.

* `COUNT_TRANSACTIONS_LOCAL_PROPOSED`

  Number of transactions which originated on this member and were sent to the group.

* `COUNT_TRANSACTIONS_LOCAL_ROLLBACK`

  Number of transactions which originated on this member and were rolled back by the group.

The `replication_group_member_stats` table has no indexes.

`TRUNCATE TABLE` is not permitted for the `replication_group_member_stats` table.
