#### 7.6.3.4 Thread Pool Tuning

This section provides guidelines on determining the best configuration for thread pool performance, as measured using a metric such as transactions per second.

Of chief importance is the number of thread groups in the thread pool, which can be set on server startup using the `--thread-pool-size` option; this cannot be changed at runtime. Recommended values for this option depend on whether the primary storage engine in use is `InnoDB` or `MyISAM`:

* If the primary storage engine is `InnoDB`, the recommended value for the thread pool size is the number of physical cores available on the host machine, up to a maximum of 512.
* If the primary storage engine is `MyISAM`, the thread pool size should be fairly low. Optimal performance is often seen with values from 4 to 8. Higher values tend to have a slightly negative but not dramatic impact on performance.

The upper limit on the number of concurrent transactions that can be processed by the thread pool plugin is determined by the value of `thread_pool_max_transactions_limit`. The recommendation initial setting for this system variable is the number of physical cores times 32. You may need to adjust the value from this starting point to suit a given workload; a reasonable upper bound for this value is the maximum number of concurrent connections expected; the value of the `Max_used_connections` status variable can serve as a guide to determining this. A good way to proceed is to start with `thread_pool_max_transactions_limit` set to this value, then adjust it downwards while observing the effect on throughput.

The maximum number of query threads permitted in a thread group is determined by the value of `thread_pool_query_threads_per_group`, which can be adjusted at runtime. The product of this value and the thread pool size is approximately equal to the total number of threads available to process queries. Obtaining the best performance usually means striking the proper balance for your application between `thread_pool_query_threads_per_group` and the thread pool size. Greater values for `thread_pool_query_threads_per_group` value make it less likely that all the threads in the thread group simultaneously execute long running queries while blocking shorter ones when the workload includes both long and short running queries. You should bear in mind that the overhead of the connection polling operation for each thread group increases when using smaller values for the thread pool size with larger values for `thread_pool_query_threads_per_group`. For this reason, we recommend a starting value of 2 for `thread_pool_query_threads_per_group`; setting this variable to a lower value usually does not offer any performance benefit.

For best performance under normal conditions, we also recommend that you set `thread_pool_algorithm` to 1 for high concurrency.

In addition, the value of the `thread_pool_stall_limit` system variable determines the handling of blocked and long-running statements. If all calls blocking the MySQL Server were reported to the thread pool, it would always know when execution threads are blocked, but this may not always be true. For example, blocks could occur in code that has not been instrumented with thread pool callbacks. For such cases, the thread pool must be able to identify threads that appear to be blocked. This is done by means of a timeout determined by the value of `thread_pool_stall_limit`, which ensures that the server does not become completely blocked. The value of `thread_pool_stall_limit` represents a number of 10-millisecond intervals, so that `600` (the maximum) represents 6 seconds.

 `thread_pool_stall_limit` also enables the thread pool to handle long-running statements. If a long-running statement were permitted to block a thread group, all other connections assigned to the group would be blocked and unable to start execution until the long-running statement completed. In the worst case, this could take hours or even days.

The value of `thread_pool_stall_limit` should be chosen such that statements that execute longer than its value are considered stalled. Stalled statements generate a lot of extra overhead since they involve extra context switches and in some cases even extra thread creations. On the other hand, setting the `thread_pool_stall_limit` parameter too high means that long-running statements block a number of short-running statements for longer than necessary. Short wait values permit threads to start more quickly. Short values are also better for avoiding deadlock situations. Long wait values are useful for workloads that include long-running statements, to avoid starting too many new statements while the current ones execute.

Suppose a server executes a workload where 99.9% of the statements complete within 100ms even when the server is loaded, and the remaining statements take between 100ms and 2 hours fairly evenly spread. In this case, it would make sense to set `thread_pool_stall_limit` to 10 (10 × 10ms = 100ms). The default value of 6 (60ms) is suitable for servers that primarily execute very simple statements.

The  `thread_pool_stall_limit` parameter can be changed at runtime to enable you to strike a balance appropriate for the server work load. Assuming that the `tp_thread_group_stats` table is enabled, you can use the following query to determine the fraction of executed statements that stalled:

```
SELECT SUM(STALLED_QUERIES_EXECUTED) / SUM(QUERIES_EXECUTED)
FROM performance_schema.tp_thread_group_stats;
```

This number should be as low as possible. To decrease the likelihood of statements stalling, increase the value of `thread_pool_stall_limit`.

When a statement arrives, what is the maximum time it can be delayed before it actually starts executing? Suppose that the following conditions apply:

* There are 200 statements queued in the low-priority queue.
* There are 10 statements queued in the high-priority queue.
*  `thread_pool_prio_kickup_timer` is set to 10000 (10 seconds).
*  `thread_pool_stall_limit` is set to 100 (1 second).

In the worst case, the 10 high-priority statements represent 10 transactions that continue executing for a long time. Thus, in the worst case, no statements can be moved to the high-priority queue because it always already contains statements awaiting execution. After 10 seconds, the new statement is eligible to be moved to the high-priority queue. However, before it can be moved, all the statements before it must be moved as well. This could take another 2 seconds because a maximum of 100 statements per second are moved to the high-priority queue. Now when the statement reaches the high-priority queue, there could potentially be many long-running statements ahead of it. In the worst case, every one of those becomes stalled and 1 second is required for each statement before the next statement is retrieved from the high-priority queue. Thus, in this scenario, it takes 222 seconds before the new statement starts executing.

This example shows a worst case for an application. How to handle it depends on the application. If the application has high requirements for the response time, it should most likely throttle users at a higher level itself. Otherwise, it can use the thread pool configuration parameters to set some kind of a maximum waiting time.
