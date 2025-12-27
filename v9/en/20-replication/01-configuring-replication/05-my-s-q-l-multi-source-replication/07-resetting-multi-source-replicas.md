#### 19.1.5.7 Resetting Multi-Source Replicas

The `RESET REPLICA` statement can be used to reset a multi-source replica. By default, if you use the `RESET REPLICA` statement on a multi-source replica all channels are reset. Optionally, use the `FOR CHANNEL channel` clause to reset only a specific channel.

* To reset all currently configured replication channels:

  ```
  mysql> RESET REPLICA;
  ```

* To reset only a named channel, use a `FOR CHANNEL channel` clause:

  ```
  mysql> RESET REPLICA FOR CHANNEL "source_1";
  ```

For GTID-based replication, note that `RESET REPLICA` has no effect on the replica's GTID execution history. If you want to clear this, issue `RESET BINARY LOGS AND GTIDS` on the replica.

`RESET REPLICA` makes the replica forget its replication position, and clears the relay log, but it does not change any replication connection parameters (such as the source host name) or replication filters. If you want to remove these for a channel, issue `RESET REPLICA ALL`.
