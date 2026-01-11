#### 25.6.16.19 The ndbinfo cpustat_50ms Table

The `cpustat_50ms` table provides raw, per-thread CPU data obtained each 50 milliseconds for each thread running in the `NDB` kernel.

Like `cpustat_1sec` and `cpustat_20sec`, this table shows 20 measurement sets per thread, each referencing a period of the named duration. Thus, `cpsustat_50ms` provides 1 second of history.

The `cpustat_50ms` table contains the following columns:

* `node_id`

  ID of the node where the thread is running

* `thr_no`

  Thread ID (specific to this node)

* `OS_user_time`

  OS user time

* `OS_system_time`

  OS system time

* `OS_idle_time`

  OS idle time

* `exec_time`

  Thread execution time

* `sleep_time`

  Thread sleep time

* `spin_time`

  Thread spin time

* `send_time`

  Thread send time

* `buffer_full_time`

  Thread buffer full time

* `elapsed_time`

  Elapsed time
