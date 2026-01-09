#### 25.6.15.21 The ndbinfo cpustat_1sec Table

The `cpustat-1sec` table provides raw, per-thread CPU data obtained each second for each thread running in the `NDB` kernel.

Like `cpustat_50ms` and `cpustat_20sec`, this table shows 20 measurement sets per thread, each referencing a period of the named duration. Thus, `cpsustat_1sec` provides 20 seconds of history.

The `cpustat_1sec` table contains the following columns:

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
