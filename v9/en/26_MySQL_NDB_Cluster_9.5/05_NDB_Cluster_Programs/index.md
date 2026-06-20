## 25.5 NDB Cluster Programs

Using and managing an NDB Cluster requires several specialized
programs, which we describe in this chapter. We discuss the purposes
of these programs in an NDB Cluster, how to use the programs, and
what startup options are available for each of them.

These programs include the NDB Cluster data, management, and SQL
node processes ([**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon"), [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"),
[**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), and [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server")) and the
management client ([**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client")).

For information about using [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") as an NDB
Cluster process, see [Section 25.6.10, “MySQL Server Usage for NDB Cluster”](mysql-cluster-mysqld.html "25.6.10 MySQL Server Usage for NDB Cluster").

Other [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") utility, diagnostic, and
example programs are included with the NDB Cluster distribution.
These include [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup"),
[**ndb\_show\_tables**](mysql-cluster-programs-ndb-show-tables.html "25.5.27 ndb_show_tables — Display List of NDB Tables"), and
[**ndb\_config**](mysql-cluster-programs-ndb-config.html "25.5.7 ndb_config — Extract NDB Cluster Configuration Information"). These programs are also covered in
this section.