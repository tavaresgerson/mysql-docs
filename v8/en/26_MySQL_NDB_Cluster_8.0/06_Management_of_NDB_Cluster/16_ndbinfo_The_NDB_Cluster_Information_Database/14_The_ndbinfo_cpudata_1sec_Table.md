#### 25.6.16.14 The ndbinfo cpudata_1sec Table

The `cpudata_1sec` table provides data about CPU usage per second over the last 20 seconds.

The `cpustat` table contains the following columns:

* `node_id`

  Node ID

* `measurement_id`

  Measurement sequence ID; later measurements have lower IDs

* `cpu_no`

  CPU ID

* `cpu_online`

  1 if the CPU is currently online, otherwise 0

* `cpu_userspace_time`

  CPU time spent in userspace

* `cpu_idle_time`

  CPU time spent idle

* `cpu_system_time`

  CPU time spent in system time

* `cpu_interrupt_time`

  CPU time spent handling interrupts (hardware and software)

* `cpu_exec_vm_time`

  CPU time spent in virtual machine execution

* `elapsed_time`

  Time in microseconds used for this measurement

##### Notes

The `cpudata_1sec` table is available only on Linux and Solaris operating systems.

This table was added in NDB 8.0.23.
