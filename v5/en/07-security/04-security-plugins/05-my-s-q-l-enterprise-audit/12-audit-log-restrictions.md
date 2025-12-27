#### 6.4.5.12 Audit Log Restrictions

MySQL Enterprise Audit is subject to these general restrictions:

* Only SQL statements are logged. Changes made by no-SQL APIs, such as memcached, Node.JS, and the NDB API, are not logged.

* Only top-level statements are logged, not statements within stored programs such as triggers or stored procedures.

* Contents of files referenced by statements such as [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") are not logged.

* Prior to MySQL 5.7.21, MySQL Enterprise Audit uses `MyISAM` tables in the `mysql` system database. Group Replication does not support `MyISAM` tables. Consequently, MySQL Enterprise Audit and Group Replication cannot be used together.

**NDB Cluster.** It is possible to use MySQL Enterprise Audit with MySQL NDB Cluster, subject to the following conditions:

* All changes to be logged must be done using the SQL interface. Changes using no-SQL interfaces, such as those provided by the NDB API, memcached, or ClusterJ, are not logged.

* The plugin must be installed on each MySQL server that is used to execute SQL on the cluster.

* Audit plugin data must be aggregated amongst all MySQL servers used with the cluster. This aggregation is the responsibility of the application or user.
