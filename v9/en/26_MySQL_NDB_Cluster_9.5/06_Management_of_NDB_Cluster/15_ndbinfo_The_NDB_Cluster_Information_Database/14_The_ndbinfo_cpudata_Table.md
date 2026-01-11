#### 25.6.15.14 The ndbinfo cpudata Table

The `cpudata` table provides data about CPU usage during the last second.

The `cpustat` table contains the following columns:

* `node_id`

  Node ID

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

##### Notes

The `cpudata` table is available only on Linux and Solaris operating systems.
