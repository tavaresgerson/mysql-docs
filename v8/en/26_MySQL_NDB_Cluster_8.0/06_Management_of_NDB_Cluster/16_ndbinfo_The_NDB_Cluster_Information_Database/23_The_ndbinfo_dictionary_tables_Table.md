#### 25.6.16.23 The ndbinfo dictionary_tables Table

This table provides `NDB` dictionary information for `NDB` tables. `dictionary_tables` contains the columns listed here:

* `table_id`

  The table' unique ID

* `database_name`

  Name of the database containing the table

* `table_name`

  Name of the table

* `status`

  The table status; one of `New`, `Changed`, `Retrieved`, `Invalid`, or `Altered`. (See Object::Status, for more information about object status values.)

* `attributes`

  Number of table attributes

* `primary_key_cols`

  Number of columns in the table's primary key

* `primary_key`

  A comma-separated list of the columns in the table's primary key

* `storage`

  Type of storage used by the table; one of `memory`, `disk`, or `default`

* `logging`

  Whether logging is enabled for this table

* `dynamic`

  `1` if the table is dynamic, otherwise `0`; the table is considered dynamic if `table->``getForceVarPart()` is true, or if at least one table column is dynamic

* `read_backup`

  `1` if read from any replica (`READ_BACKUP` option is enabled for this table, otherwise `0`; see Section 15.1.20.12, “Setting NDB Comment Options”)

* `fully_replicated`

  `1` if `FULLY_REPLICATED` is enabled for this table (each data node in the cluster has a complete copy of the table), `0` if not; see Section 15.1.20.12, “Setting NDB Comment Options”

* `checksum`

  If this table uses a checksum, the value in this column is `1`; if not, it is `0`

* `row_size`

  The amount of data, in bytes that can be stored in one row, not including any blob data stored separately in blob tables; see Table::getRowSizeInBytes(), in the API documentation, for more information

* `min_rows`

  Minimum number of rows, as used for calculating partitions; see Table::getMinRows(), in the API documentation, for more information

* `max_rows`

  Maximum number of rows, as used for calculating partitions; see Table::getMaxRows(), in the API documentation, for more information

* `tablespace`

  ID of the tablespace to which the table belongs, if any; this is `0`, if the table does not use data on disk

* `fragment_type`

  The table's fragment type; one of `Single`, `AllSmall`, `AllMedium`, `AllLarge`, `DistrKeyHash`, `DistrKeyLin`, `UserDefined`, `unused`, or `HashMapPartition`; for more information, see Object::FragmentType, in the NDB API documentation

* `hash_map`

  The hash map used by the table

* `fragments`

  Number of table fragments

* `partitions`

  Number of partitions used by the table

* `partition_balance`

  Type of partition balance used, if any; one of `FOR_RP_BY_NODE`, `FOR_RA_BY_NODE`, `FOR_RP_BY_LDM`, `FOR_RA_BY_LDM`, `FOR_RA_BY_LDM_X_2`, `FOR_RA_BY_LDM_X_3`, or `FOR_RA_BY_LDM_X_4`; see Section 15.1.20.12, “Setting NDB Comment Options”

* `contains_GCI`

  `1` if the table includes a global checkpoint index, otherwise `0`

* `single_user_mode`

  Type of access allowed to the table when single user mode is in effect; one of `locked`, `read_only`, or `read_write`; these are equivalent to the values `SingleUserModeLocked`, `SingleUserModeReadOnly`, and `SingleUserModeReadWrite`, respectively, of the `Table::SingleUserMode` type in the NDB API

* `force_var_part`

  This is `1` if `table->``getForceVarPart()` is true for this table, and `0` if it is not

* `GCI_bits`

  Used in testing

* `author_bits`

  Used in testing

The `dictionary_tables` table was added in NDB 8.0.29.
