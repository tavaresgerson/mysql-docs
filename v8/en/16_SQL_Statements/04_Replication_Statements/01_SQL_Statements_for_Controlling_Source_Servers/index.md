### 15.4.1 SQL Statements for Controlling Source Servers

This section discusses statements for managing replication source servers. Section 15.4.2, “SQL Statements for Controlling Replica Servers”, discusses statements for managing replica servers.

In addition to the statements described here, the following `SHOW` statements are used with source servers in replication. For information about these statements, see Section 15.7.7, “SHOW Statements”.

* `SHOW BINARY LOGS`
* `SHOW BINLOG EVENTS`
* `SHOW MASTER STATUS`
* [`SHOW REPLICAS`](show-replicas.html "15.7.7.33 SHOW REPLICAS Statement") (or before MySQL 8.0.22, [`SHOW SLAVE HOSTS`](show-slave-hosts.html "15.7.7.34 SHOW SLAVE HOSTS | SHOW REPLICAS Statement"))