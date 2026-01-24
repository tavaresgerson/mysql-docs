#### 21.6.15.41 The ndbinfo threadblocks Table

The `threadblocks` table associates data nodes, threads, and instances of `NDB` kernel blocks.

The `threadblocks` table contains the following columns:

* `node_id`

  Node ID

* `thr_no`

  Thread ID

* `block_name`

  Block name

* `block_instance`

  Block instance number

##### Notes

The value of the `block_name` in this table is one of the values found in the `block_name` column when selecting from the [`ndbinfo.blocks`](mysql-cluster-ndbinfo-blocks.html "21.6.15.3 The ndbinfo blocks Table") table. Although the list of possible values is static for a given NDB Cluster release, the list may vary between releases.

The `block_instance` column provides the kernel block instance number.
