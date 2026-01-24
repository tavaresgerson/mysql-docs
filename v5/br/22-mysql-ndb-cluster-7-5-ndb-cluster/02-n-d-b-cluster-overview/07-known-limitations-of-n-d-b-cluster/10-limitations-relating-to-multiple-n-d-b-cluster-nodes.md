#### 21.2.7.10 Limitations Relating to Multiple NDB Cluster Nodes

**Multiple SQL nodes.** The following are issues relating to the use of multiple MySQL servers as NDB Cluster SQL nodes, and are specific to the [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine:

* **Stored programs not distributed.** Stored procedures, stored functions, triggers, and scheduled events are all supported by tables using the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine, but these do *not* propagate automatically between MySQL Servers acting as Cluster SQL nodes, and must be re-created separately on each SQL node. See [Stored Programs in NDB Cluster](stored-program-restrictions.html#stored-routines-ndbcluster "Stored Programs in NDB Cluster").

* **No distributed table locks.** A [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") statement or [`GET_LOCK()`](locking-functions.html#function_get-lock) call works only for the SQL node on which the lock is issued; no other SQL node in the cluster “sees” this lock. This is true for a lock issued by any statement that locks tables as part of its operations. (See next item for an example.)

  Implementing table locks in `NDBCLUSTER` can be done in an API application, and ensuring that all applications start by setting [`LockMode`](/doc/ndbapi/en/ndb-ndboperation.html#ndb-ndboperation-lockmode) to `LM_Read` or `LM_Exclusive`. For more information about how to do this, see the description of [`NdbOperation::getLockHandle()`](/doc/ndbapi/en/ndb-ndboperation.html#ndb-ndboperation-getlockhandle) in the *NDB Cluster API Guide*.

* **ALTER TABLE operations.** [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") is not fully locking when running multiple MySQL servers (SQL nodes). (As discussed in the previous item, NDB Cluster does not support distributed table locks.)

**Multiple management nodes.** When using multiple management servers:

* If any of the management servers are running on the same host, you must give nodes explicit IDs in connection strings because automatic allocation of node IDs does not work across multiple management servers on the same host. This is not required if every management server resides on a different host.

* When a management server starts, it first checks for any other management server in the same NDB Cluster, and upon successful connection to the other management server uses its configuration data. This means that the management server [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) and [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) startup options are ignored unless the management server is the only one running. It also means that, when performing a rolling restart of an NDB Cluster with multiple management nodes, the management server reads its own configuration file if (and only if) it is the only management server running in this NDB Cluster. See [Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Performing a Rolling Restart of an NDB Cluster"), for more information.

**Multiple network addresses.** Multiple network addresses per data node are not supported. Use of these is liable to cause problems: In the event of a data node failure, an SQL node waits for confirmation that the data node went down but never receives it because another route to that data node remains open. This can effectively make the cluster inoperable.

Note

It is possible to use multiple network hardware *interfaces* (such as Ethernet cards) for a single data node, but these must be bound to the same address. This also means that it not possible to use more than one `[tcp]` section per connection in the `config.ini` file. See [Section 21.4.3.10, “NDB Cluster TCP/IP Connections”](mysql-cluster-tcp-definition.html "21.4.3.10 NDB Cluster TCP/IP Connections"), for more information.
