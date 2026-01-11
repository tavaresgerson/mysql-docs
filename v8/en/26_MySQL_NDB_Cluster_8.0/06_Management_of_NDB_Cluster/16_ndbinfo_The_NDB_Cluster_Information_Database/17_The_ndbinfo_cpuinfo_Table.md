#### 25.6.16.17 The ndbinfo cpuinfo Table

The `cpuinfo` table provides information about the CPU on which a given data node executes.

The `cpuinfo` table contains the following columns:

* `node_id`

  Node ID

* `cpu_no`

  CPU ID

* `cpu_online`

  1 if the CPU is online, otherwise 0

* `core_id`

  CPU core ID

* `socket_id`

  CPU socket ID

##### Notes

The `cpuinfo` table is available on all operating systems supported by `NDB`, with the exception of MacOS and FreeBSD.

This table was added in NDB 8.0.23.
