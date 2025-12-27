#### 5.5.3.3 Thread Pool Operation

The thread pool consists of a number of thread groups, each of which manages a set of client connections. As connections are established, the thread pool assigns them to thread groups in round-robin fashion.

The thread pool exposes system variables that may be used to configure its operation:

* [`thread_pool_algorithm`](server-system-variables.html#sysvar_thread_pool_algorithm): The concurrency algorithm to use for scheduling.

* [`thread_pool_high_priority_connection`](server-system-variables.html#sysvar_thread_pool_high_priority_connection): How to schedule statement execution for a session.

* [`thread_pool_max_unused_threads`](server-system-variables.html#sysvar_thread_pool_max_unused_threads): How many sleeping threads to permit.

* [`thread_pool_prio_kickup_timer`](server-system-variables.html#sysvar_thread_pool_prio_kickup_timer): How long before the thread pool moves a statement awaiting execution from the low-priority queue to the high-priority queue.

* [`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size): The number of thread groups in the thread pool. This is the most important parameter controlling thread pool performance.

* [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit): The time before an executing statement is considered to be stalled.

To configure the number of thread groups, use the [`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size) system variable. The default number of groups is 16. For guidelines on setting this variable, see [Section 5.5.3.4, “Thread Pool Tuning”](thread-pool-tuning.html "5.5.3.4 Thread Pool Tuning").

The maximum number of threads per group is 4096 (or 4095 on some systems where one thread is used internally).

The thread pool separates connections and threads, so there is no fixed relationship between connections and the threads that execute statements received from those connections. This differs from the default thread-handling model that associates one thread with one connection such that a given thread executes all statements from its connection.

The thread pool tries to ensure a maximum of one thread executing in each group at any time, but sometimes permits more threads to execute temporarily for best performance:

* Each thread group has a listener thread that listens for incoming statements from the connections assigned to the group. When a statement arrives, the thread group either begins executing it immediately or queues it for later execution:

  + Immediate execution occurs if the statement is the only one received and no statements are queued or currently executing.

  + Queuing occurs if the statement cannot begin executing immediately.

* If immediate execution occurs, the listener thread performs it. (This means that temporarily no thread in the group is listening.) If the statement finishes quickly, the executing thread returns to listening for statements. Otherwise, the thread pool considers the statement stalled and starts another thread as a listener thread (creating it if necessary). To ensure that no thread group becomes blocked by stalled statements, the thread pool has a background thread that regularly monitors thread group states.

  By using the listening thread to execute a statement that can begin immediately, there is no need to create an additional thread if the statement finishes quickly. This ensures the most efficient execution possible in the case of a low number of concurrent threads.

  When the thread pool plugin starts, it creates one thread per group (the listener thread), plus the background thread. Additional threads are created as necessary to execute statements.

* The value of the [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) system variable determines the meaning of “finishes quickly” in the previous item. The default time before threads are considered stalled is 60ms but can be set to a maximum of 6s. This parameter is configurable to enable you to strike a balance appropriate for the server work load. Short wait values permit threads to start more quickly. Short values are also better for avoiding deadlock situations. Long wait values are useful for workloads that include long-running statements, to avoid starting too many new statements while the current ones execute.

* The thread pool focuses on limiting the number of concurrent short-running statements. Before an executing statement reaches the stall time, it prevents other statements from beginning to execute. If the statement executes past the stall time, it is permitted to continue but no longer prevents other statements from starting. In this way, the thread pool tries to ensure that in each thread group there is never more than one short-running statement, although there might be multiple long-running statements. It is undesirable to let long-running statements prevent other statements from executing because there is no limit on the amount of waiting that might be necessary. For example, on a replication source, a thread that is sending binary log events to a replica effectively runs forever.

* A statement becomes blocked if it encounters a disk I/O operation or a user level lock (row lock or table lock). The block would cause the thread group to become unused, so there are callbacks to the thread pool to ensure that the thread pool can immediately start a new thread in this group to execute another statement. When a blocked thread returns, the thread pool permits it to restart immediately.

* There are two queues, a high-priority queue and a low-priority queue. The first statement in a transaction goes to the low-priority queue. Any following statements for the transaction go to the high-priority queue if the transaction is ongoing (statements for it have begun executing), or to the low-priority queue otherwise. Queue assignment can be affected by enabling the [`thread_pool_high_priority_connection`](server-system-variables.html#sysvar_thread_pool_high_priority_connection) system variable, which causes all queued statements for a session to go into the high-priority queue.

  Statements for a nontransactional storage engine, or a transactional engine if [`autocommit`](server-system-variables.html#sysvar_autocommit) is enabled, are treated as low-priority statements because in this case each statement is a transaction. Thus, given a mix of statements for `InnoDB` and `MyISAM` tables, the thread pool prioritizes those for `InnoDB` over those for `MyISAM` unless [`autocommit`](server-system-variables.html#sysvar_autocommit) is enabled. With [`autocommit`](server-system-variables.html#sysvar_autocommit) enabled, all statements are low priority.

* When the thread group selects a queued statement for execution, it first looks in the high-priority queue, then in the low-priority queue. If a statement is found, it is removed from its queue and begins to execute.

* If a statement stays in the low-priority queue too long, the thread pool moves to the high-priority queue. The value of the [`thread_pool_prio_kickup_timer`](server-system-variables.html#sysvar_thread_pool_prio_kickup_timer) system variable controls the time before movement. For each thread group, a maximum of one statement per 10ms (100 per second) is moved from the low-priority queue to the high-priority queue.

* The thread pool reuses the most active threads to obtain a much better use of CPU caches. This is a small adjustment that has a great impact on performance.

* While a thread executes a statement from a user connection, Performance Schema instrumentation accounts thread activity to the user connection. Otherwise, Performance Schema accounts activity to the thread pool.

Here are examples of conditions under which a thread group might have multiple threads started to execute statements:

* One thread begins executing a statement, but runs long enough to be considered stalled. The thread group permits another thread to begin executing another statement even through the first thread is still executing.

* One thread begins executing a statement, then becomes blocked and reports this back to the thread pool. The thread group permits another thread to begin executing another statement.

* One thread begins executing a statement, becomes blocked, but does not report back that it is blocked because the block does not occur in code that has been instrumented with thread pool callbacks. In this case, the thread appears to the thread group to be still running. If the block lasts long enough for the statement to be considered stalled, the group permits another thread to begin executing another statement.

The thread pool is designed to be scalable across an increasing number of connections. It is also designed to avoid deadlocks that can arise from limiting the number of actively executing statements. It is important that threads that do not report back to the thread pool do not prevent other statements from executing and thus cause the thread pool to become deadlocked. Examples of such statements follow:

* Long-running statements. These would lead to all resources used by only a few statements and they could prevent all others from accessing the server.

* Binary log dump threads that read the binary log and send it to replicas. This is a kind of long-running “statement” that runs for a very long time, and that should not prevent other statements from executing.

* Statements blocked on a row lock, table lock, sleep, or any other blocking activity that has not been reported back to the thread pool by MySQL Server or a storage engine.

In each case, to prevent deadlock, the statement is moved to the stalled category when it does not complete quickly, so that the thread group can permit another statement to begin executing. With this design, when a thread executes or becomes blocked for an extended time, the thread pool moves the thread to the stalled category and for the rest of the statement's execution, it does not prevent other statements from executing.

The maximum number of threads that can occur is the sum of [`max_connections`](server-system-variables.html#sysvar_max_connections) and [`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size). This can happen in a situation where all connections are in execution mode and an extra thread is created per group to listen for more statements. This is not necessarily a state that happens often, but it is theoretically possible.
