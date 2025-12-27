#### 16.2.3.2 Monitoring Replication Applier Worker Threads

On a multithreaded replica, the Performance Schema tables [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table") and [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table") show status information for the replica's coordinator thread and applier worker threads respectively. For a replica with multiple channels, the threads for each channel are identified.

A multithreaded replica's coordinator thread also prints statistics to the replica's error log on a regular basis if the verbosity setting is set to display informational messages. The statistics are printed depending on the volume of events that the coordinator thread has assigned to applier worker threads, with a maximum frequency of once every 120 seconds. The message lists the following statistics for the relevant replication channel, or the default replication channel (which is not named):

Seconds elapsed :   The difference in seconds between the current time and the last time this information was printed to the error log.

Events assigned :   The total number of events that the coordinator thread has queued to all applier worker threads since the coordinator thread was started.

Worker queues filled over overrun level :   The current number of events that are queued to any of the applier worker threads in excess of the overrun level, which is set at 90% of the maximum queue length of 16384 events. If this value is zero, no applier worker threads are operating at the upper limit of their capacity.

Waited due to worker queue full :   The number of times that the coordinator thread had to wait to schedule an event because an applier worker thread's queue was full. If this value is zero, no applier worker threads exhausted their capacity.

Waited due to the total size :   The number of times that the coordinator thread had to wait to schedule an event because the [`slave_pending_jobs_size_max`](replication-options-replica.html#sysvar_slave_pending_jobs_size_max) limit had been reached. This system variable sets the maximum amount of memory (in bytes) available to applier worker thread queues holding events not yet applied. If an unusually large event exceeds this size, the transaction is held until all the applier worker threads have empty queues, and then processed. All subsequent transactions are held until the large transaction has been completed.

Waited at clock conflicts :   The number of nanoseconds that the coordinator thread had to wait to schedule an event because a transaction that the event depended on had not yet been committed. If [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type) is set to `DATABASE` (rather than `LOGICAL_CLOCK`), this value is always zero.

Waited (count) when workers occupied :   The number of times that the coordinator thread slept for a short period, which it might do in two situations. The first situation is where the coordinator thread assigns an event and finds the applier worker thread's queue is filled beyond the underrun level of 10% of the maximum queue length, in which case it sleeps for a maximum of 1 millisecond. The second situation is where [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type) is set to `LOGICAL_CLOCK` and the coordinator thread needs to assign the first event of a transaction to an applier worker thread's queue, it only does this to a worker with an empty queue, so if no queues are empty, the coordinator thread sleeps until one becomes empty.

Waited when workers occupied :   The number of nanoseconds that the coordinator thread slept while waiting for an empty applier worker thread queue (that is, in the second situation described above, where [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type) is set to `LOGICAL_CLOCK` and the first event of a transaction needs to be assigned).
