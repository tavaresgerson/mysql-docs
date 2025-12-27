#### 21.6.15.14 The ndbinfo cpustat\_20sec Table

The `cpustat_20sec` table provides raw, per-thread CPU data obtained each 20 seconds, for each thread running in the `NDB` kernel.

Like [`cpustat_50ms`](mysql-cluster-ndbinfo-cpustat-50ms.html "21.6.15.12 The ndbinfo cpustat_50ms Table") and [`cpustat_1sec`](mysql-cluster-ndbinfo-cpustat-1sec.html "21.6.15.13 The ndbinfo cpustat_1sec Table"), this table shows 20 measurement sets per thread, each referencing a period of the named duration. Thus, `cpsustat_20sec` provides 400 seconds of history.

The `cpustat_20sec` table contains the following columns:

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

##### Notes

This table was added in NDB 7.5.2.
