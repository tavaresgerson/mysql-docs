#### 21.6.15.43 The ndbinfo threadstat Table

The `threadstat` table provides a rough snapshot of statistics for threads running in the `NDB` kernel.

The `threadstat` table contains the following columns:

* `node_id`

  Node ID

* `thr_no`

  Thread ID

* `thr_nm`

  Thread name

* `c_loop`

  Number of loops in main loop

* `c_exec`

  Number of signals executed

* `c_wait`

  Number of times waiting for additional input

* `c_l_sent_prioa`

  Number of priority A signals sent to own node

* `c_l_sent_priob`

  Number of priority B signals sent to own node

* `c_r_sent_prioa`

  Number of priority A signals sent to remote node

* `c_r_sent_priob`

  Number of priority B signals sent to remote node

* `os_tid`

  OS thread ID

* `os_now`

  OS time (ms)

* `os_ru_utime`

  OS user CPU time (µs)

* `os_ru_stime`

  OS system CPU time (µs)

* `os_ru_minflt`

  OS page reclaims (soft page faults)

* `os_ru_majflt`

  OS page faults (hard page faults)

* `os_ru_nvcsw`

  OS voluntary context switches

* `os_ru_nivcsw`

  OS involuntary context switches

##### Notes

`os_time` uses the system `gettimeofday()` call.

The values of the `os_ru_utime`, `os_ru_stime`, `os_ru_minflt`, `os_ru_majflt`, `os_ru_nvcsw`, and `os_ru_nivcsw` columns are obtained using the system `getrusage()` call, or the equivalent.

Since this table contains counts taken at a given point in time, for best results it is necessary to query this table periodically and store the results in an intermediate table or tables. The MySQL Server's Event Scheduler can be employed to automate such monitoring. For more information, see [Section 23.4, “Using the Event Scheduler”](event-scheduler.html "23.4 Using the Event Scheduler").
