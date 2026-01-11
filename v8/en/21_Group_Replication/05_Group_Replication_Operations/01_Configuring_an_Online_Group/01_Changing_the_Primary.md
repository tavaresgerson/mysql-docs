#### 20.5.1.1 Changing the Primary

This section explains how to change which member of a single-primary group is the primary, using the `group_replication_set_as_primary()` function, which can be can be run on any member of the group. When this is done, the current primary becomes a read-only secondary, and the specified group member becomes the read-write primary; this replaces the usual primary election process as described in Section 20.1.3.1, “Single-Primary Mode”.

If a standard source-to-replica replication channel is running on the existing primary member in addition to the Group Replication channels, you must stop that replication channel before you can change the primary member. You can identify the current primary using the `MEMBER_ROLE` column in the Performance Schema table `replication_group_members`, or the `group_replication_primary_member` status variable.

If all members are not running the same MySQL Server version, you can specify a new primary member that is running the lowest MySQL Server version in the group only. This safeguard is applied to ensure the group maintains compatibility with new functions. This is recommended for all MySQL versions, and enforced beginning with MySQL 8.0.17.

Any uncommitted transactions that the group is waiting on must be committed, rolled back, or terminated before the operation can complete. Before MySQL 8.0.29, the function waits for all active transactions on the existing primary to end, including incoming transactions that are started after the function is used. As of MySQL 8.0.29, you can specify a timeout from 1 to 3600 seconds (60 minutes) for transactions that are running when you use the function. For the timeout to work, all members of the group must be at MySQL 8.0.29 or higher. Specify 0 for no timeout (or do not specify a timeout value), in which case the group waits indefinitely. If you do not set the timeout, there is no upper limit to the wait time, and new transactions can start during that time.

When the timeout expires, for any transactions that did not yet reach their commit phase, the client session is disconnected so that the transaction does not proceed. Transactions that reached their commit phase are allowed to complete. When you set a timeout, it also prevents new transactions starting on the primary from that point on. Explicitly defined transactions (with a `START TRANSACTION` or `BEGIN` statement) are subject to the timeout, disconnection, and incoming transaction blocking even if they do not modify any data. To allow inspection of the primary while the function is operating, single statements that do not modify data, as listed in Permitted Queries Under Consistency Rules, are permitted to proceed.

Pass in the `server_uuid` of the member which you want to become the new primary of the group by issuing the following statement:

```
SELECT group_replication_set_as_primary(member_uuid);
```

In MySQL 8.0.29 and later, you can add a timeout, as shown here:

```
SELECT group_replication_set_as_primary(‘00371d66-3c45-11ea-804b-080027337932’, 300)
```

To check the status of the timeout, use the `PROCESSLIST_INFO` column in the Performance Schema `threads` table, like this:

```
mysql> SELECT NAME, PROCESSLIST_INFO FROM performance_schema.threads
    -> WHERE NAME="thread/group_rpl/THD_transaction_monitor"\G
*************************** 1. row ***************************
            NAME: thread/group_rpl/THD_transaction_monitor
PROCESSLIST_INFO: Group replication transaction monitor: Stopped client connections
```

The status shows when the transaction monitoring thread has been created, when new transactions have been stopped, when the client connections with uncommitted transactions have been disconnected, and finally, when the process is complete and new transactions are allowed again.

While the action runs, you can check its progress by issuing the statement shown here:

```
mysql> SELECT event_name, work_completed, work_estimated
    -> FROM performance_schema.events_stages_current
    -> WHERE event_name LIKE "%stage/group_rpl%"\G
*************************** 1. row ***************************
    EVENT_NAME: stage/group_rpl/Primary Election: Waiting for members to turn on super_read_only
WORK_COMPLETED: 3
WORK_ESTIMATED: 5
```
