### 25.2.6 MySQL Server Using InnoDB Compared with NDB Cluster

MySQL Server offers a number of choices in storage engines. Since
both [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") and
[`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") can serve as transactional
MySQL storage engines, users of MySQL Server sometimes become
interested in NDB Cluster. They see
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") as a possible alternative or
upgrade to the default [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") storage
engine in MySQL. While [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") and
[`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") share common characteristics,
there are differences in architecture and implementation, so that
some existing MySQL Server applications and usage scenarios can be
a good fit for NDB Cluster, but not all of them.

In this section, we discuss and compare some characteristics of
the [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") storage engine used by NDB
9.5 with [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") used in
MySQL 9.5. The next few sections provide a technical
comparison. In many instances, decisions about when and where to
use NDB Cluster must be made on a case-by-case basis, taking all
factors into consideration. While it is beyond the scope of this
documentation to provide specifics for every conceivable usage
scenario, we also attempt to offer some very general guidance on
the relative suitability of some common types of applications for
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") as opposed to
[`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") back ends.

NDB Cluster 9.5 uses a [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server")
based on MySQL 9.5, including support for
[`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") 1.1. While it is possible to
use `InnoDB` tables with NDB Cluster, such tables
are not clustered. It is also not possible to use programs or
libraries from an NDB Cluster 9.5 distribution with
MySQL Server 9.5, or the reverse.

While it is also true that some types of common business
applications can be run either on NDB Cluster or on MySQL Server
(most likely using the [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") storage
engine), there are some important architectural and implementation
differences. [Section 25.2.6.1, “Differences Between the NDB and InnoDB Storage Engines”](mysql-cluster-ndb-innodb-engines.html "25.2.6.1 Differences Between the NDB and InnoDB Storage Engines"),
provides a summary of the these differences. Due to the
differences, some usage scenarios are clearly more suitable for
one engine or the other; see
[Section 25.2.6.2, “NDB and InnoDB Workloads”](mysql-cluster-ndb-innodb-workloads.html "25.2.6.2 NDB and InnoDB Workloads"). This in turn
has an impact on the types of applications that better suited for
use with [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") or
[`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine"). See
[Section 25.2.6.3, “NDB and InnoDB Feature Usage Summary”](mysql-cluster-ndb-innodb-usage.html "25.2.6.3 NDB and InnoDB Feature Usage Summary"), for a comparison
of the relative suitability of each for use in common types of
database applications.

For information about the relative characteristics of the
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") and
[`MEMORY`](memory-storage-engine.html "18.3 The MEMORY Storage Engine") storage engines, see
[When to Use MEMORY or NDB Cluster](memory-storage-engine.html#memory-storage-engine-compared-cluster "When to Use MEMORY or NDB Cluster").

See [Chapter 18, *Alternative Storage Engines*](storage-engines.html "Chapter 18 Alternative Storage Engines"), for additional information
about MySQL storage engines.