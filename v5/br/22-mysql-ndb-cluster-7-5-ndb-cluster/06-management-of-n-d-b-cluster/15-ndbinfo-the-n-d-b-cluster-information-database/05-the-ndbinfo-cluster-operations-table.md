#### 21.6.15.5 The ndbinfo cluster_operations Table

The `cluster_operations` table provides a per-operation (stateful primary key op) view of all activity in the NDB Cluster from the point of view of the local data management (LQH) blocks (see [The DBLQH Block](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html)).

The `cluster_operations` table contains the following columns:

* `node_id`

  Node ID of reporting LQH block

* `block_instance`

  LQH block instance

* `transid`

  Transaction ID

* `operation_type`

  Operation type (see text for possible values)

* `state`

  Operation state (see text for possible values)

* `tableid`

  Table ID

* `fragmentid`

  Fragment ID

* `client_node_id`

  Client node ID

* `client_block_ref`

  Client block reference

* `tc_node_id`

  Transaction coordinator node ID

* `tc_block_no`

  Transaction coordinator block number

* `tc_block_instance`

  Transaction coordinator block instance

##### Notes

The transaction ID is a unique 64-bit number which can be obtained using the NDB API's [`getTransactionId()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-gettransactionid) method. (Currently, the MySQL Server does not expose the NDB API transaction ID of an ongoing transaction.)

The `operation_type` column can take any one of the values `READ`, `READ-SH`, `READ-EX`, `INSERT`, `UPDATE`, `DELETE`, `WRITE`, `UNLOCK`, `REFRESH`, `SCAN`, `SCAN-SH`, `SCAN-EX`, or `<unknown>`.

The `state` column can have any one of the values `ABORT_QUEUED`, `ABORT_STOPPED`, `COMMITTED`, `COMMIT_QUEUED`, `COMMIT_STOPPED`, `COPY_CLOSE_STOPPED`, `COPY_FIRST_STOPPED`, `COPY_STOPPED`, `COPY_TUPKEY`, `IDLE`, `LOG_ABORT_QUEUED`, `LOG_COMMIT_QUEUED`, `LOG_COMMIT_QUEUED_WAIT_SIGNAL`, `LOG_COMMIT_WRITTEN`, `LOG_COMMIT_WRITTEN_WAIT_SIGNAL`, `LOG_QUEUED`, `PREPARED`, `PREPARED_RECEIVED_COMMIT`, `SCAN_CHECK_STOPPED`, `SCAN_CLOSE_STOPPED`, `SCAN_FIRST_STOPPED`, `SCAN_RELEASE_STOPPED`, `SCAN_STATE_USED`, `SCAN_STOPPED`, `SCAN_TUPKEY`, `STOPPED`, `TC_NOT_CONNECTED`, `WAIT_ACC`, `WAIT_ACC_ABORT`, `WAIT_AI_AFTER_ABORT`, `WAIT_ATTR`, `WAIT_SCAN_AI`, `WAIT_TUP`, `WAIT_TUPKEYINFO`, `WAIT_TUP_COMMIT`, or `WAIT_TUP_TO_ABORT`. (If the MySQL Server is running with [`ndbinfo_show_hidden`](mysql-cluster-options-variables.html#sysvar_ndbinfo_show_hidden) enabled, you can view this list of states by selecting from the `ndb$dblqh_tcconnect_state` table, which is normally hidden.)

You can obtain the name of an `NDB` table from its table ID by checking the output of [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables").

The `fragid` is the same as the partition number seen in the output of [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") [`--extra-partition-info`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-partition-info) (short form `-p`).

In `client_node_id` and `client_block_ref`, `client` refers to an NDB Cluster API or SQL node (that is, an NDB API client or a MySQL Server attached to the cluster).

The `block_instance` and `tc_block_instance` column provide, respectively, the [`DBLQH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html) and [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) block instance numbers. You can use these along with the block names to obtain information about specific threads from the [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table") table.
