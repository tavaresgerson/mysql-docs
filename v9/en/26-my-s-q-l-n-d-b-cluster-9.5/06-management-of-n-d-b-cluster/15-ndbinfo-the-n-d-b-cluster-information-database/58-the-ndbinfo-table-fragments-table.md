#### 25.6.15.58 The ndbinfo table_fragments Table

The `table_fragments` table provides information about the fragmentation, partitioning, distribution, and (internal) replication of `NDB` tables.

The `table_fragments` table contains the following columns:

* `node_id`

  Node ID (`DIH` master)

* `table_id`

  Table ID

* `partition_id`

  Partition ID

* `fragment_id`

  Fragment ID (same as partition ID unless table is fully replicated)

* `partition_order`

  Order of fragment in partition

* `log_part_id`

  Log part ID of fragment

* `no_of_replicas`

  Number of fragment replicas

* `current_primary`

  Current primary node ID

* `preferred_primary`

  Preferred primary node ID

* `current_first_backup`

  Current first backup node ID

* `current_second_backup`

  Current second backup node ID

* `current_third_backup`

  Current third backup node ID

* `num_alive_replicas`

  Current number of live fragment replicas

* `num_dead_replicas`

  Current number of dead fragment replicas

* `num_lcp_replicas`

  Number of fragment replicas remaining to be checkpointed
