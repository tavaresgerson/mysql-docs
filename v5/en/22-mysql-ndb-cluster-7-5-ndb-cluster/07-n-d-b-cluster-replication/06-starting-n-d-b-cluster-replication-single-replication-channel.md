### 21.7.6 Starting NDB Cluster Replication (Single Replication Channel)

This section outlines the procedure for starting NDB Cluster replication using a single replication channel.

1. Start the MySQL replication source server by issuing this command, where *`id`* is this server's unique ID (see [Section 21.7.2, “General Requirements for NDB Cluster Replication”](mysql-cluster-replication-general.html "21.7.2 General Requirements for NDB Cluster Replication")):

   ```sql
   shellS> mysqld --ndbcluster --server-id=id \
           --log-bin --ndb-log-bin &
   ```

   This starts the server's [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process with binary logging enabled using the proper logging format.

   Note

   You can also start the source with [`--binlog-format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format), in which case row-based replication is used automatically when replicating between clusters. Statement-based binary logging is not supported for NDB Cluster Replication (see [Section 21.7.2, “General Requirements for NDB Cluster Replication”](mysql-cluster-replication-general.html "21.7.2 General Requirements for NDB Cluster Replication")).

2. Start the MySQL replica server as shown here:

   ```sql
   shellR> mysqld --ndbcluster --server-id=id &
   ```

   In the command just shown, *`id`* is the replica server's unique ID. It is not necessary to enable logging on the replica.

   Note

   You should use the [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) option with this command or else you should include `skip-slave-start` in the replica server's `my.cnf` file, unless you want replication to begin immediately. With the use of this option, the start of replication is delayed until the appropriate [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement has been issued, as explained in Step 4 below.

3. It is necessary to synchronize the replica server with the source server's replication binary log. If binary logging has not previously been running on the source, run the following statement on the replica:

   ```sql
   mysqlR> CHANGE MASTER TO
        -> MASTER_LOG_FILE='',
        -> MASTER_LOG_POS=4;
   ```

   This instructs the replica to begin reading the source server's binary log from the log's starting point. Otherwise—that is, if you are loading data from the source using a backup—see [Section 21.7.8, “Implementing Failover with NDB Cluster Replication”](mysql-cluster-replication-failover.html "21.7.8 Implementing Failover with NDB Cluster Replication"), for information on how to obtain the correct values to use for `MASTER_LOG_FILE` and `MASTER_LOG_POS` in such cases.

4. Finally, instruct the replica to begin applying replication by issuing this command from the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client on the replica:

   ```sql
   mysqlR> START SLAVE;
   ```

   This also initiates the transmission of data and changes from the source to the replica.

It is also possible to use two replication channels, in a manner similar to the procedure described in the next section; the differences between this and using a single replication channel are covered in [Section 21.7.7, “Using Two Replication Channels for NDB Cluster Replication”](mysql-cluster-replication-two-channels.html "21.7.7 Using Two Replication Channels for NDB Cluster Replication").

It is also possible to improve cluster replication performance by enabling batched updates. This can be accomplished by setting the [`slave_allow_batching`](mysql-cluster-options-variables.html#sysvar_slave_allow_batching) system variable on the replicas' [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") processes. Normally, updates are applied as soon as they are received. However, the use of batching causes updates to be applied in batches of 32 KB each; this can result in higher throughput and less CPU usage, particularly where individual updates are relatively small.

Note

Batching works on a per-epoch basis; updates belonging to more than one transaction can be sent as part of the same batch.

All outstanding updates are applied when the end of an epoch is reached, even if the updates total less than 32 KB.

Batching can be turned on and off at runtime. To activate it at runtime, you can use either of these two statements:

```sql
SET GLOBAL slave_allow_batching = 1;
SET GLOBAL slave_allow_batching = ON;
```

If a particular batch causes problems (such as a statement whose effects do not appear to be replicated correctly), batching can be deactivated using either of the following statements:

```sql
SET GLOBAL slave_allow_batching = 0;
SET GLOBAL slave_allow_batching = OFF;
```

You can check whether batching is currently being used by means of an appropriate [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement, like this one:

```sql
mysql> SHOW VARIABLES LIKE 'slave%';
+---------------------------+-------+
| Variable_name             | Value |
+---------------------------+-------+
| slave_allow_batching      | ON    |
| slave_compressed_protocol | OFF   |
| slave_load_tmpdir         | /tmp  |
| slave_net_timeout         | 3600  |
| slave_skip_errors         | OFF   |
| slave_transaction_retries | 10    |
+---------------------------+-------+
6 rows in set (0.00 sec)
```
