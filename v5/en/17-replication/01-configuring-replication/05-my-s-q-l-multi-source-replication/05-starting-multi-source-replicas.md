#### 16.1.5.5 Starting Multi-Source Replicas

Once you have added channels for all of the sources, issue a [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement to start replication. When you have enabled multiple channels on a replica, you can choose to either start all channels, or select a specific channel to start. For example, to start the two channels separately, use the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client to issue the following statements:

```sql
mysql> START SLAVE FOR CHANNEL "source_1";
mysql> START SLAVE FOR CHANNEL "source_2";
```

For the full syntax of the [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") command and other available options, see [Section 13.4.2.5, “START SLAVE Statement”](start-slave.html "13.4.2.5 START SLAVE Statement").

To verify that both channels have started and are operating correctly, you can issue [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") statements on the replica, for example:

```sql
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_1"\G
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_2"\G
```
