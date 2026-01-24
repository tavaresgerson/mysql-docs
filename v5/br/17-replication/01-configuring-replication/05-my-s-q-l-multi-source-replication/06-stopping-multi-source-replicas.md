#### 16.1.5.6 Stopping Multi-Source Replicas

The [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") statement can be used to stop a multi-source replica. By default, if you use the [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") statement on a multi-source replica all channels are stopped. Optionally, use the `FOR CHANNEL channel` clause to stop only a specific channel.

* To stop all currently configured replication channels:

  ```sql
  STOP SLAVE;
  ```

* To stop only a named channel, use a `FOR CHANNEL channel` clause:

  ```sql
  STOP SLAVE FOR CHANNEL "source_1";
  ```

For the full syntax of the [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") command and other available options, see [Section 13.4.2.6, “STOP SLAVE Statement”](stop-slave.html "13.4.2.6 STOP SLAVE Statement").
