#### 19.1.5.5 Starting Multi-Source Replicas

Once you have added channels for all of the replication sources,
issue a [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement") (or before
MySQL 8.0.22, [`START SLAVE`](start-slave.html "15.4.2.7 START SLAVE Statement"))
statement to start replication. When you have enabled multiple
channels on a replica, you can choose to either start all
channels, or select a specific channel to start. For example, to
start the two channels separately, use the
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client to issue the following statements:

```
mysql> START SLAVE FOR CHANNEL "source_1";
mysql> START SLAVE FOR CHANNEL "source_2";
Or from MySQL 8.0.22:
mysql> START REPLICA FOR CHANNEL "source_1";
mysql> START REPLICA FOR CHANNEL "source_2";
```

For the full syntax of the [`START
REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement") command and other available options, see
[Section 15.4.2.6, “START REPLICA Statement”](start-replica.html "15.4.2.6 START REPLICA Statement").

To verify that both channels have started and are operating
correctly, you can issue [`SHOW REPLICA
STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") statements on the replica, for example:

```
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_1"\G
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_2"\G
Or from MySQL 8.0.22:
mysql> SHOW REPLICA STATUS FOR CHANNEL "source_1"\G
mysql> SHOW REPLICA STATUS FOR CHANNEL "source_2"\G
```