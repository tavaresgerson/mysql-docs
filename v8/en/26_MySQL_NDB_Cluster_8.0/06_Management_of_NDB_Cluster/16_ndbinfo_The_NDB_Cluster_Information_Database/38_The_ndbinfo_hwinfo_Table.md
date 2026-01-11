#### 25.6.16.38 The ndbinfo hwinfo Table

The `hwinfo` table provides information about the hardware on which a given data node executes.

The `hwinfo` table contains the following columns:

* `node_id`

  Node ID

* `cpu_cnt_max`

  Number of processors on this host

* `cpu_cnt`

  Number of processors available to this node

* `num_cpu_cores`

  Number of CPU cores on this host

* `num_cpu_sockets`

  Number of CPU sockets on this host

* `HW_memory_size`

  Amount of memory available on this host

* `model_name`

  CPU model name

##### Notes

The `hwinfo` table is available on all operating systems supported by `NDB`.

This table was added in NDB 8.0.23.
