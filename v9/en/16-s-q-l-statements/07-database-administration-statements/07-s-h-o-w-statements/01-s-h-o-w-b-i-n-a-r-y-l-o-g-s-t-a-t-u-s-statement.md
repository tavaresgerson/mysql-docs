#### 15.7.7.1 SHOW BINARY LOG STATUS Statement

```
SHOW BINARY LOG STATUS
```

This statement provides status information about binary log files on the source server, and requires the `REPLICATION CLIENT` privilege (or the deprecated `SUPER` privilege).

Example:

```
mysql> SHOW BINARY LOG STATUS\G
*************************** 1. row ***************************
             File: source-bin.000002
         Position: 1307
     Binlog_Do_DB: test
 Binlog_Ignore_DB: manual, mysql
Executed_Gtid_Set: 3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
1 row in set (0.00 sec)
```

When global transaction IDs are in use, `Executed_Gtid_Set` shows the set of GTIDs for transactions that have been executed on the source. This is the same as the value for the `gtid_executed` system variable on this server, as well as the value for `Executed_Gtid_Set` in the output of `SHOW REPLICA STATUS` on this server.
