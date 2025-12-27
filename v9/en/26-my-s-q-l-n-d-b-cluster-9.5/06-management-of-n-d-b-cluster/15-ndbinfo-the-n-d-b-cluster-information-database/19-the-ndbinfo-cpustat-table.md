#### 25.6.15.19 The ndbinfo cpustat Table

The `cpustat` table provides per-thread CPU statistics gathered each second, for each thread running in the `NDB` kernel.

The `cpustat` table contains the following columns:

* `node_id`

  ID of the node where the thread is running

* `thr_no`

  Thread ID (specific to this node)

* `OS_user`

  OS user time

* `OS_system`

  OS system time

* `OS_idle`

  OS idle time

* `thread_exec`

  Thread execution time

* `thread_sleeping`

  Thread sleep time

* `thread_spinning`

  Thread spin time

* `thread_send`

  Thread send time

* `thread_buffer_full`

  Thread buffer full time

* `elapsed_time`

  Elapsed time
