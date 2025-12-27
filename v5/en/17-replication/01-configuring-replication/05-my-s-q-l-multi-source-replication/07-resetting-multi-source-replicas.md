#### 16.1.5.7 Resetting Multi-Source Replicas

The [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") statement can be used to reset a multi-source replica. By default, if you use the [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") statement on a multi-source replica all channels are reset. Optionally, use the `FOR CHANNEL channel` clause to reset only a specific channel.

* To reset all currently configured replication channels:

  ```sql
  RESET SLAVE;
  ```

* To reset only a named channel, use a `FOR CHANNEL channel` clause:

  ```sql
  RESET SLAVE FOR CHANNEL "source_1";
  ```

For GTID-based replication, note that [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") has no effect on the replica's GTID execution history. If you want to clear this, issue [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") on the replica.

[`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") makes the replica forget its replication position, and clears the relay log, but it does not change any replication connection parameters, such as the source's host name. If you want to remove these for a channel, issue `RESET SLAVE ALL`.

For the full syntax of the [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") command and other available options, see [Section 13.4.2.3, “RESET SLAVE Statement”](reset-slave.html "13.4.2.3 RESET SLAVE Statement").
