#### 16.2.3.1 Monitoring Replication Main Threads

The [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") statement provides information that tells you what is happening on the source and on the replica regarding replication. For information on source states, see [Section 8.14.5, “Replication Source Thread States”](source-thread-states.html "8.14.5 Replication Source Thread States"). For replica states, see [Section 8.14.6, “Replication Replica I/O Thread States”](replica-io-thread-states.html "8.14.6 Replication Replica I/O Thread States"), and [Section 8.14.7, “Replication Replica SQL Thread States”](replica-sql-thread-states.html "8.14.7 Replication Replica SQL Thread States").

The following example illustrates how the three main replication threads, the binary log dump thread, replicatin I/O thread, and replication SQL thread, show up in the output from [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

On the source server, the output from [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") looks like this:

```sql
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 2
   User: root
   Host: localhost:32931
     db: NULL
Command: Binlog Dump
   Time: 94
  State: Has sent all binlog to slave; waiting for binlog to
         be updated
   Info: NULL
```

Here, thread 2 is a `Binlog Dump` thread that services a connected replica. The `State` information indicates that all outstanding updates have been sent to the replica and that the source is waiting for more updates to occur. If you see no `Binlog Dump` threads on a source server, this means that replication is not running; that is, no replicas are currently connected.

On a replica server, the output from [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") looks like this:

```sql
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 10
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 11
  State: Waiting for master to send event
   Info: NULL
*************************** 2. row ***************************
     Id: 11
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 11
  State: Has read all relay log; waiting for the slave I/O
         thread to update it
   Info: NULL
```

The `State` information indicates that thread 10 is the replication I/O thread that is communicating with the source server, and thread 11 is the replication SQL thread that is processing the updates stored in the relay logs. At the time that [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") was run, both threads were idle, waiting for further updates.

The value in the `Time` column can show how late the replica is compared to the source. See [Section A.14, “MySQL 5.7 FAQ: Replication”](faqs-replication.html "A.14 MySQL 5.7 FAQ: Replication"). If sufficient time elapses on the source side without activity on the `Binlog Dump` thread, the source determines that the replica is no longer connected. As for any other client connection, the timeouts for this depend on the values of `net_write_timeout` and `net_retry_count`; for more information about these, see [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

The [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") statement provides additional information about replication processing on a replica server. See [Section 16.1.7.1, “Checking Replication Status”](replication-administration-status.html "16.1.7.1 Checking Replication Status").
