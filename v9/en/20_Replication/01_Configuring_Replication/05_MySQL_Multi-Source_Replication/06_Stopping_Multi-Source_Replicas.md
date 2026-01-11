#### 19.1.5.6 Stopping Multi-Source Replicas

The `STOP REPLICA` statement can be used to stop a multi-source replica. By default, if you use the `STOP REPLICA` statement on a multi-source replica all channels are stopped. Optionally, use the `FOR CHANNEL channel` clause to stop only a specific channel.

* To stop all currently configured replication channels:

  ```
  mysql> STOP REPLICA;
  ```

* To stop only a named channel, use a `FOR CHANNEL channel` clause:

  ```
  mysql> STOP REPLICA FOR CHANNEL "source_1";
  ```

For the full syntax of the `STOP REPLICA` statement and other available options, see Section 15.4.2.5, “STOP REPLICA Statement”.
