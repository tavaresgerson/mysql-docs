### 15.4.1 SQL Statements for Controlling Source Servers

15.4.1.1 PURGE BINARY LOGS Statement

15.4.1.2 RESET MASTER Statement

15.4.1.3 SET sql_log_bin Statement

This section discusses statements for managing replication source servers. Section 15.4.2, “SQL Statements for Controlling Replica Servers”, discusses statements for managing replica servers.

In addition to the statements described here, the following `SHOW` statements are used with source servers in replication. For information about these statements, see Section 15.7.7, “SHOW Statements”.

* `SHOW BINARY LOGS`
* `SHOW BINLOG EVENTS`
* `SHOW MASTER STATUS`
* `SHOW REPLICAS` (or before MySQL 8.0.22, `SHOW SLAVE HOSTS`)
