### 15.4.1 SQL Statements for Controlling Source Servers

[15.4.1.1 PURGE BINARY LOGS Statement](purge-binary-logs.html)

[15.4.1.2 RESET MASTER Statement](reset-master.html)

[15.4.1.3 SET sql\_log\_bin Statement](set-sql-log-bin.html)

This section discusses statements for managing replication source
servers. [Section 15.4.2, “SQL Statements for Controlling Replica Servers”](replication-statements-replica.html "15.4.2 SQL Statements for Controlling Replica Servers"),
discusses statements for managing replica servers.

In addition to the statements described here, the following
[`SHOW`](show.html "15.7.7 SHOW Statements") statements are used with
source servers in replication. For information about these
statements, see [Section 15.7.7, “SHOW Statements”](show.html "15.7.7 SHOW Statements").

* [`SHOW BINARY LOGS`](show-binary-logs.html "15.7.7.1 SHOW BINARY LOGS Statement")
* [`SHOW BINLOG EVENTS`](show-binlog-events.html "15.7.7.2 SHOW BINLOG EVENTS Statement")
* [`SHOW MASTER STATUS`](show-master-status.html "15.7.7.23 SHOW MASTER STATUS Statement")
* [`SHOW
  REPLICAS`](show-replicas.html "15.7.7.33 SHOW REPLICAS Statement") (or before MySQL 8.0.22,
  [`SHOW SLAVE
  HOSTS`](show-slave-hosts.html "15.7.7.34 SHOW SLAVE HOSTS | SHOW REPLICAS Statement"))