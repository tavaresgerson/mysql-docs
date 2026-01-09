#### 21.6.15.29 The ndbinfo operations_per_fragment Table

The `operations_per_fragment` table provides information about the operations performed on individual fragments and fragment replicas, as well as about some of the results from these operations.

The `operations_per_fragment` table contains the following columns:

* `fq_name`

  Name of this fragment

* `parent_fq_name`

  Name of this fragment's parent

* `type`

  Type of object; see text for possible values

* `table_id`

  Table ID for this table

* `node_id`

  Node ID for this node

* `block_instance`

  Kernel block instance ID

* `fragment_num`

  Fragment ID (number)

* `tot_key_reads`

  Total number of key reads for this fragment replica

* `tot_key_inserts`

  Total number of key inserts for this fragment replica

* `tot_key_updates`

  total number of key updates for this fragment replica

* `tot_key_writes`

  Total number of key writes for this fragment replica

* `tot_key_deletes`

  Total number of key deletes for this fragment replica

* `tot_key_refs`

  Number of key operations refused

* `tot_key_attrinfo_bytes`

  Total size of all `attrinfo` attributes

* `tot_key_keyinfo_bytes`

  Total size of all `keyinfo` attributes

* `tot_key_prog_bytes`

  Total size of all interpreted programs carried by `attrinfo` attributes

* `tot_key_inst_exec`

  Total number of instructions executed by interpreted programs for key operations

* `tot_key_bytes_returned`

  Total size of all data and metadata returned from key read operations

* `tot_frag_scans`

  Total number of scans performed on this fragment replica

* `tot_scan_rows_examined`

  Total number of rows examined by scans

* `tot_scan_rows_returned`

  Total number of rows returned to client

* `tot_scan_bytes_returned`

  Total size of data and metadata returned to the client

* `tot_scan_prog_bytes`

  Total size of interpreted programs for scan operations

* `tot_scan_bound_bytes`

  Total size of all bounds used in ordered index scans

* `tot_scan_inst_exec`

  Total number of instructions executed for scans

* `tot_qd_frag_scans`

  Number of times that scans of this fragment replica have been queued

* `conc_frag_scans`

  Number of scans currently active on this fragment replica (excluding queued scans)

* `conc_qd_frag_scans`

  Number of scans currently queued for this fragment replica

* `tot_commits`

  Total number of row changes committed to this fragment replica

##### Notes

The `fq_name` contains the fully qualified name of the schema object to which this fragment replica belongs. This currently has the following formats:

* Base table: `DbName/def/TblName`

* `BLOB` table: `DbName/def/NDB$BLOB_BaseTblId_ColNo`

* Ordered index: `sys/def/BaseTblId/IndexName`

* Unique index: `sys/def/BaseTblId/IndexName$unique`

The `$unique` suffix shown for unique indexes is added by [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"); for an index created by a different NDB API client application, this may differ, or not be present.

The syntax just shown for fully qualified object names is an internal interface which is subject to change in future releases.

Consider a table `t1` created and modified by the following SQL statements:

```sql
CREATE DATABASE mydb;

USE mydb;

CREATE TABLE t1 (
  a INT NOT NULL,
  b INT NOT NULL,
  t TEXT NOT NULL,
  PRIMARY KEY (b)
) ENGINE=ndbcluster;

CREATE UNIQUE INDEX ix1 ON t1(b) USING HASH;
```

If `t1` is assigned table ID 11, this yields the `fq_name` values shown here:

* Base table: `mydb/def/t1`
* `BLOB` table: `mydb/def/NDB$BLOB_11_2`

* Ordered index (primary key): `sys/def/11/PRIMARY`

* Unique index: `sys/def/11/ix1$unique`

For indexes or `BLOB` tables, the `parent_fq_name` column contains the `fq_name` of the corresponding base table. For base tables, this column is always `NULL`.

The `type` column shows the schema object type used for this fragment, which can take any one of the values `System table`, `User table`, `Unique hash index`, or `Ordered index`. `BLOB` tables are shown as `User table`.

The `table_id` column value is unique at any given time, but can be reused if the corresponding object has been deleted. The same ID can be seen using the [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables") utility.

The `block_instance` column shows which LDM instance this fragment replica belongs to. You can use this to obtain information about specific threads from the [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table") table. The first such instance is always numbered 0.

Since there are typically two replicas, and assuming that this is so, each `fragment_num` value should appear twice in the table, on two different data nodes from the same node group.

Since `NDB` does not use single-key access for ordered indexes, the counts for `tot_key_reads`, `tot_key_inserts`, `tot_key_updates`, `tot_key_writes`, and `tot_key_deletes` are not incremented by ordered index operations.

Note

When using `tot_key_writes`, you should keep in mind that a write operation in this context updates the row if the key exists, and inserts a new row otherwise. (One use of this is in the `NDB` implementation of the [`REPLACE`](replace.html "13.2.8 REPLACE Statement") SQL statement.)

The `tot_key_refs` column shows the number of key operations refused by the LDM. Generally, such a refusal is due to duplicate keys (inserts), Key not found errors (updates, deletes, and reads), or the operation was rejected by an interpreted program used as a predicate on the row matching the key.

The `attrinfo` and `keyinfo` attributes counted by the `tot_key_attrinfo_bytes` and `tot_key_keyinfo_bytes` columns are attributes of an `LQHKEYREQ` signal (see [The NDB Communication Protocol](/doc/ndb-internals/en/ndb-internals-ndb-protocol.html)) used to initiate a key operation by the LDM. An `attrinfo` typically contains tuple field values (inserts and updates) or projection specifications (for reads); `keyinfo` contains the primary or unique key needed to locate a given tuple in this schema object.

The value shown by `tot_frag_scans` includes both full scans (that examine every row) and scans of subsets. Unique indexes and `BLOB` tables are never scanned, so this value, like other scan-related counts, is 0 for fragment replicas of these.

`tot_scan_rows_examined` may display less than the total number of rows in a given fragment replica, since ordered index scans can limited by bounds. In addition, a client may choose to end a scan before all potentially matching rows have been examined; this occurs when using an SQL statement containing a `LIMIT` or `EXISTS` clause, for example. `tot_scan_rows_returned` is always less than or equal to `tot_scan_rows_examined`.

`tot_scan_bytes_returned` includes, in the case of pushed joins, projections returned to the [`DBSPJ`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html) block in the NDB kernel.

`tot_qd_frag_scans` can be effected by the setting for the [`MaxParallelScansPerFragment`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxparallelscansperfragment) data node configuration parameter, which limits the number of scans that may execute concurrently on a single fragment replica.
