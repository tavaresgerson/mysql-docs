#### 29.12.16.1 The tp\_connections Table

The `tp_connections` table contains one row per connection managed by the Thread Pool plugin. Each row provides information about the current state of a thread pool connection.

The `tp_connections` table contains the following rows:

* `CONNECTION_ID`

  The connection ID as reported by `SELECT` `CONNECTION_ID()`.

* `TP_GROUP_ID`

  The index of the thread group in the global array. This column and `TP_PROCESSING_THREAD_NUMBER` serve as a foreign key into the `tp_thread_state` table.

* `TP_PROCESSING_THREAD_NUMBER`

  This may be NULL if no thread is currently attached to the connection.

* `THREAD_ID`

  The Performance Schema thread ID.

* `STATE`

  The connection state; this is one of `Established`, `Armed`, `Queued`, `Waiting for Credit`, `Attached`, `Expired`, or `Killed`.

* `ACTIVE_FLAG`

  When this is `0`, the connection is not attached to any worker thread.

* `KILLED_STATE`

  Reports the current stage in the process of killing the connection.

* `CLEANUP_STATE`

  Reports the current stage in the cleanup process when closing the connection.

* `TIME_OF_LAST_EVENT_COMPLETION`

  Timestamp showing when the connection last processed a request.

* `TIME_OF_EXPIRY`

  Timestamp showing when an idle connection will expire if no new request arrives before then; this is `NULL` when the thread is currently processing a request.

* `TIME_OF_ADD`

  Timestamp showing when the connection was added to the thread pool's connection request queue.

* `TIME_OF_POP`

  Timestamp showing when the connection was dequeued (popped) from the queue by a connection handler thread.

* `TIME_OF_ARM`

  Timestamp showing when the connection file descriptor was last added to the set monitored by `poll()` or `epoll()`.

* `CONNECT_HANDLER_INDEX`

  The index of the connection handler thread in the group which processed the connection request; a higher number means the connection load has triggered the creation of additional connection handler threads.

* `TYPE`

  The connection type; this is one of `User`, `Admin_interface` or `Admin_privilege`; `Admin_privilege` means that this connection had been using the normal interface, but was placed in the `admin` group due to the user having the `TP_CONNECTION_ADMIN` privilege.

* `DIRECT_QUERY_EVENTS`

  The number of queries executed directly by this connection.

* `QUEUED_QUERY_EVENTS`

  The number of queued queries executed by this connection.

* `TIME_OF_EVENT_ARRIVAL`

  A timestamp showing when `poll_wait()` returns with an event for the connection; this value is needed to calculate `MANAGEMENT_TIME`.

* `MANAGEMENT_TIME`

  The accumulated time between the return from waiting on file descriptors; this includes the time spent queued for queries which are not executed directly.
