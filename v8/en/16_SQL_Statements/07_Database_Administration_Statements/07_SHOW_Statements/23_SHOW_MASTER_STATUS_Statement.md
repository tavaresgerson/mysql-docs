#### 15.7.7.23 SHOW MASTER STATUS Statement

```
SHOW MASTER STATUS
```

This statement provides status information about the binary log
files of the source server. It requires the
[`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client) privilege (or
the deprecated [`SUPER`](privileges-provided.html#priv_super) privilege).

Example:

```
mysql> SHOW MASTER STATUS\G
*************************** 1. row ***************************
             File: source-bin.000002
         Position: 1307
     Binlog_Do_DB: test
 Binlog_Ignore_DB: manual, mysql
Executed_Gtid_Set: 3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
1 row in set (0.00 sec)
```

When global transaction IDs are in use,
`Executed_Gtid_Set` shows the set of GTIDs for
transactions that have been executed on the source. This is the
same as the value for the
[`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) system variable
on this server, as well as the value for
`Executed_Gtid_Set` in the output of
[`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") (or before
MySQL 8.0.22, [`SHOW SLAVE STATUS`](show-slave-status.html "15.7.7.36 SHOW SLAVE | REPLICA STATUS Statement"))
on this server.