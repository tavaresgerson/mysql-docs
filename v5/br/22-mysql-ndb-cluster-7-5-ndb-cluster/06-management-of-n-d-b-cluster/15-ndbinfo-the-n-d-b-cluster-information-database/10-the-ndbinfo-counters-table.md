#### 21.6.15.10 The ndbinfo counters Table

The `counters` table provides running totals of events such as reads and writes for specific kernel blocks and data nodes. Counts are kept from the most recent node start or restart; a node start or restart resets all counters on that node. Not all kernel blocks have all types of counters.

The `counters` table contains the following columns:

* `node_id`

  The data node ID

* `block_name`

  Name of the associated NDB kernel block (see [NDB Kernel Blocks](/doc/ndb-internals/en/ndb-internals-kernel-blocks.html)).

* `block_instance`

  Block instance

* `counter_id`

  The counter's internal ID number; normally an integer between 1 and 10, inclusive.

* `counter_name`

  The name of the counter. See text for names of individual counters and the NDB kernel block with which each counter is associated.

* `val`

  The counter's value

##### Notes

Each counter is associated with a particular NDB kernel block.

The `OPERATIONS` counter is associated with the [`DBLQH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html) (local query handler) kernel block (see [The DBLQH Block](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html)). A primary-key read counts as one operation, as does a primary-key update. For reads, there is one operation in [`DBLQH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html) per operation in [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html). For writes, there is one operation counted per fragment replica.

The `ATTRINFO`, `TRANSACTIONS`, `COMMITS`, `READS`, `LOCAL_READS`, `SIMPLE_READS`, `WRITES`, `LOCAL_WRITES`, `ABORTS`, `TABLE_SCANS`, and `RANGE_SCANS` counters are associated with the DBTC (transaction co-ordinator) kernel block (see [The DBTC Block](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html)).

`LOCAL_WRITES` and `LOCAL_READS` are primary-key operations using a transaction coordinator in a node that also holds the primary fragment replica of the record.

The `READS` counter includes all reads. `LOCAL_READS` includes only those reads of the primary fragment replica on the same node as this transaction coordinator. `SIMPLE_READS` includes only those reads in which the read operation is the beginning and ending operation for a given transaction. Simple reads do not hold locks but are part of a transaction, in that they observe uncommitted changes made by the transaction containing them but not of any other uncommitted transactions. Such reads are “simple” from the point of view of the TC block; since they hold no locks they are not durable, and once [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) has routed them to the relevant LQH block, it holds no state for them.

`ATTRINFO` keeps a count of the number of times an interpreted program is sent to the data node. See [NDB Protocol Messages](/doc/ndb-internals/en/ndb-internals-ndb-protocol-messages.html), for more information about `ATTRINFO` messages in the `NDB` kernel.

The `LOCAL_TABLE_SCANS_SENT`, `READS_RECEIVED`, `PRUNED_RANGE_SCANS_RECEIVED`, `RANGE_SCANS_RECEIVED`, `LOCAL_READS_SENT`, `CONST_PRUNED_RANGE_SCANS_RECEIVED`, `LOCAL_RANGE_SCANS_SENT`, `REMOTE_READS_SENT`, `REMOTE_RANGE_SCANS_SENT`, `READS_NOT_FOUND`, `SCAN_BATCHES_RETURNED`, `TABLE_SCANS_RECEIVED`, and `SCAN_ROWS_RETURNED` counters are associated with the [`DBSPJ`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html) (select push-down join) kernel block (see [The DBSPJ Block](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html)).

The `block_name` and `block_instance` columns provide, respectively, the applicable NDB kernel block name and instance number. You can use these to obtain information about specific threads from the [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table") table.

A number of counters provide information about transporter overload and send buffer sizing when troubleshooting such issues. For each LQH instance, there is one instance of each counter in the following list:

* `LQHKEY_OVERLOAD`: Number of primary key requests rejected at the LQH block instance due to transporter overload

* `LQHKEY_OVERLOAD_TC`: Count of instances of `LQHKEY_OVERLOAD` where the TC node transporter was overloaded

* `LQHKEY_OVERLOAD_READER`: Count of instances of `LQHKEY_OVERLOAD` where the API reader (reads only) node was overloaded.

* `LQHKEY_OVERLOAD_NODE_PEER`: Count of instances of `LQHKEY_OVERLOAD` where the next backup data node (writes only) was overloaded

* `LQHKEY_OVERLOAD_SUBSCRIBER`: Count of instances of `LQHKEY_OVERLOAD` where a event subscriber (writes only) was overloaded.

* `LQHSCAN_SLOWDOWNS`: Count of instances where a fragment scan batch size was reduced due to scanning API transporter overload.
