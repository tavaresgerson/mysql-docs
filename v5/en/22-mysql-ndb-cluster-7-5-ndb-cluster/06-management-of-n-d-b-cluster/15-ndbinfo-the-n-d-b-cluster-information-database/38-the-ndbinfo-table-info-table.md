#### 21.6.15.38 The ndbinfo table_info Table

The `table_info` table provides information about logging, checkpointing, distribution, and storage options in effect for individual `NDB` tables.

The `table_info` table contains the following columns:

* `table_id`

  Table ID

* `logged_table`

  Whether table is logged (1) or not (0)

* `row_contains_gci`

  Whether table rows contain GCI (1 true, 0 false)

* `row_contains_checksum`

  Whether table rows contain checksum (1 true, 0 false)

* `read_backup`

  If backup fragment replicas are read this is 1, otherwise 0

* `fully_replicated`

  If table is fully replicated this is 1, otherwise 0

* `storage_type`

  Table storage type; one of `MEMORY` or `DISK`

* `hashmap_id`

  Hashmap ID

* `partition_balance`

  Partition balance (fragment count type) used for table; one of `FOR_RP_BY_NODE`, `FOR_RA_BY_NODE`, `FOR_RP_BY_LDM`, or `FOR_RA_BY_LDM`

* `create_gci`

  GCI in which table was created

##### Notes

The `table_info` table was added in NDB 7.5.4.
