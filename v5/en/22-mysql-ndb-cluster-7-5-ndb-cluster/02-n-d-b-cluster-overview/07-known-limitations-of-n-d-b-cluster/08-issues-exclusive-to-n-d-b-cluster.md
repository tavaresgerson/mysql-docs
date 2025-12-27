#### 21.2.7.8 Issues Exclusive to NDB Cluster

The following are limitations specific to the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine:

* **Machine architecture.** All machines used in the cluster must have the same architecture. That is, all machines hosting nodes must be either big-endian or little-endian, and you cannot use a mixture of both. For example, you cannot have a management node running on a PowerPC which directs a data node that is running on an x86 machine. This restriction does not apply to machines simply running [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") or other clients that may be accessing the cluster's SQL nodes.

* **Binary logging.** NDB Cluster has the following limitations or restrictions with regard to binary logging:

  + NDB Cluster cannot produce a binary log for tables having [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") columns but no primary key.

  + Only the following schema operations are logged in a cluster binary log which is *not* on the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") executing the statement:

    - [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement")
    - [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement")
    - [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement")
    - [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") / [`CREATE SCHEMA`](create-database.html "13.1.11 CREATE DATABASE Statement")

    - [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") / [`DROP SCHEMA`](drop-database.html "13.1.22 DROP DATABASE Statement")

    - [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement")
    - [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement")
    - [`DROP TABLESPACE`](drop-tablespace.html "13.1.30 DROP TABLESPACE Statement")
    - [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement")
    - [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement")
    - [`DROP LOGFILE GROUP`](drop-logfile-group.html "13.1.26 DROP LOGFILE GROUP Statement")
* **Schema operations.** Schema operations (DDL statements) are rejected while any data node restarts. Schema operations are also not supported while performing an online upgrade or downgrade.

* **Number of fragment replicas.** The number of fragment replicas, as determined by the [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas) data node configuration parameter, is the number of copies of all data stored by NDB Cluster. Setting this parameter to 1 means there is only a single copy; in this case, no redundancy is provided, and the loss of a data node entails loss of data. To guarantee redundancy, and thus preservation of data even if a data node fails, set this parameter to 2, which is the default and recommended value in production.

  Setting [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas) to a value greater than 2 is possible (to a maximum of 4) but unnecessary to guard against loss of data. In addition, *values greater than 2 for this parameter are not supported in production*.

See also [Section 21.2.7.10, “Limitations Relating to Multiple NDB Cluster Nodes”](mysql-cluster-limitations-multiple-nodes.html "21.2.7.10 Limitations Relating to Multiple NDB Cluster Nodes").
