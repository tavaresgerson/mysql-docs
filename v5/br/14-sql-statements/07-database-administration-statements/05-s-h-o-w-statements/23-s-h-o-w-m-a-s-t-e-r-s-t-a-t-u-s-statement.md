#### 13.7.5.23 SHOW MASTER STATUS Statement

```sql
SHOW MASTER STATUS
```

This statement provides status information about the binary log files of the source. It requires either the [`SUPER`](privileges-provided.html#priv_super) or [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client) privilege.

Example:

```sql
mysql> SHOW MASTER STATUS\G
*************************** 1. row ***************************
             File: source-bin.000002
         Position: 1307
     Binlog_Do_DB: test
 Binlog_Ignore_DB: manual, mysql
Executed_Gtid_Set: 3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
1 row in set (0.00 sec)
```

When global transaction IDs are in use, `Executed_Gtid_Set` shows the set of GTIDs for transactions that have been executed on the source. This is the same as the value for the [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) system variable on this server, as well as the value for `Executed_Gtid_Set` in the output of [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") on this server.
