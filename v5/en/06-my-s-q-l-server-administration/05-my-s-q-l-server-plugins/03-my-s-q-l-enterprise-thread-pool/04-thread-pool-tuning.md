#### 5.5.3.4 Thread Pool Tuning

This section provides guidelines on setting thread pool system variables for best performance, measured using a metric such as transactions per second.

[`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size) is the most important parameter controlling thread pool performance. It can be set only at server startup. Our experience in testing the thread pool indicates the following:

* If the primary storage engine is [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), the optimal [`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size) setting is likely to be between 16 and 36, with the most common optimal values tending to be from 24 to 36. We have not seen any situation where the setting has been optimal beyond 36. There may be special cases where a value smaller than 16 is optimal.

  For workloads such as DBT2 and Sysbench, the optimum for [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") seems to be usually around 36. For very write-intensive workloads, the optimal setting can sometimes be lower.

* If the primary storage engine is [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), the [`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size) setting should be fairly low. Optimal performance is often seen with values from 4 to 8. Higher values tend to have a slightly negative but not dramatic impact on performance.

Another system variable, [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit), is important for handling of blocked and long-running statements. If all calls that block the MySQL Server are reported to the thread pool, it would always know when execution threads are blocked. However, this may not always be true. For example, blocks could occur in code that has not been instrumented with thread pool callbacks. For such cases, the thread pool must be able to identify threads that appear to be blocked. This is done by means of a timeout that can be tuned using the [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) system variable, the value of which is measured in 10ms units. This parameter ensures that the server does not become completely blocked. The value of [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) has an upper limit of 6 seconds to prevent the risk of a deadlocked server.

[`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) also enables the thread pool to handle long-running statements. If a long-running statement was permitted to block a thread group, all other connections assigned to the group would be blocked and unable to start execution until the long-running statement completed. In the worst case, this could take hours or even days.

The value of [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) should be chosen such that statements that execute longer than its value are considered stalled. Stalled statements generate a lot of extra overhead since they involve extra context switches and in some cases even extra thread creations. On the other hand, setting the [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) parameter too high means that long-running statements block a number of short-running statements for longer than necessary. Short wait values permit threads to start more quickly. Short values are also better for avoiding deadlock situations. Long wait values are useful for workloads that include long-running statements, to avoid starting too many new statements while the current ones execute.

Suppose a server executes a workload where 99.9% of the statements complete within 100ms even when the server is loaded, and the remaining statements take between 100ms and 2 hours fairly evenly spread. In this case, it would make sense to set [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) to 10 (10 × 10ms = 100ms). The default value of 6 (60ms) is suitable for servers that primarily execute very simple statements.

The [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) parameter can be changed at runtime to enable you to strike a balance appropriate for the server work load. Assuming that the `TP_THREAD_GROUP_STATS` table is enabled, you can use the following query to determine the fraction of executed statements that stalled:

```sql
SELECT SUM(STALLED_QUERIES_EXECUTED) / SUM(QUERIES_EXECUTED)
FROM INFORMATION_SCHEMA.TP_THREAD_GROUP_STATS;
```

This number should be as low as possible. To decrease the likelihood of statements stalling, increase the value of [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit).

When a statement arrives, what is the maximum time it can be delayed before it actually starts executing? Suppose that the following conditions apply:

* There are 200 statements queued in the low-priority queue.
* There are 10 statements queued in the high-priority queue.
* [`thread_pool_prio_kickup_timer`](server-system-variables.html#sysvar_thread_pool_prio_kickup_timer) is set to 10000 (10 seconds).

* [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) is set to 100 (1 second).

In the worst case, the 10 high-priority statements represent 10 transactions that continue executing for a long time. Thus, in the worst case, no statements are moved to the high-priority queue because it already contains statements awaiting execution. After 10 seconds, the new statement is eligible to be moved to the high-priority queue. However, before it can be moved, all the statements before it must be moved as well. This could take another 2 seconds because a maximum of 100 statements per second are moved to the high-priority queue. Now when the statement reaches the high-priority queue, there could potentially be many long-running statements ahead of it. In the worst case, every one of those becomes stalled and it takes 1 second for each statement before the next statement is retrieved from the high-priority queue. Thus, in this scenario, it takes 222 seconds before the new statement starts executing.

This example shows a worst case for an application. How to handle it depends on the application. If the application has high requirements for the response time, it should most likely throttle users at a higher level itself. Otherwise, it can use the thread pool configuration parameters to set some kind of a maximum waiting time.
