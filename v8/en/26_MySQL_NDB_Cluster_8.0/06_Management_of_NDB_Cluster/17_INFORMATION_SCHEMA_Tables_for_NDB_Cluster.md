### 25.6.17 INFORMATION\_SCHEMA Tables for NDB Cluster

Two [`INFORMATION_SCHEMA`](information-schema.html "Chapter 28 INFORMATION_SCHEMA Tables") tables provide
information that is of particular use when managing an NDB
Cluster. The [`FILES`](information-schema-files-table.html "28.3.15 The INFORMATION_SCHEMA FILES Table") table provides
information about NDB Cluster Disk Data files (see
[Section 25.6.11.1, “NDB Cluster Disk Data Objects”](mysql-cluster-disk-data-objects.html "25.6.11.1 NDB Cluster Disk Data Objects")). The
[`ndb_transid_mysql_connection_map`](information-schema-ndb-transid-mysql-connection-map-table.html "28.3.18 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table")
table provides a mapping between transactions, transaction
coordinators, and API nodes.

Additional statistical and other data about NDB Cluster
transactions, operations, threads, blocks, and other aspects of
performance can be obtained from the tables in the
[`ndbinfo`](mysql-cluster-ndbinfo.html "25.6.16 ndbinfo: The NDB Cluster Information Database") database. For
information about these tables, see
[Section 25.6.16, “ndbinfo: The NDB Cluster Information Database”](mysql-cluster-ndbinfo.html "25.6.16 ndbinfo: The NDB Cluster Information Database").