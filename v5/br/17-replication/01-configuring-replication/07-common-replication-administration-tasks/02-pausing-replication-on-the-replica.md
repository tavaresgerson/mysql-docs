#### 16.1.7.2 Pausing Replication on the Replica

You can stop and start replication on the replica using the [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") and [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statements.

To stop processing of the binary log from the source, use [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement"):

```sql
mysql> STOP SLAVE;
```

When replication is stopped, the replication I/O thread stops reading events from the source's binary log and writing them to the relay log, and the replication SQL thread stops reading events from the relay log and executing them. You can pause the replication I/O and SQL threads individually by specifying the thread type:

```sql
mysql> STOP SLAVE IO_THREAD;
mysql> STOP SLAVE SQL_THREAD;
```

To start execution again, use the [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement:

```sql
mysql> START SLAVE;
```

To start a particular thread, specify the thread type:

```sql
mysql> START SLAVE IO_THREAD;
mysql> START SLAVE SQL_THREAD;
```

For a replica that performs updates only by processing events from the source, stopping only the replication SQL thread can be useful if you want to perform a backup or other task. The replication I/O thread continues to read events from the source but they are not executed. This makes it easier for the replica to catch up when you restart the replication SQL thread.

Stopping only the replication I/O thread enables the events in the relay log to be executed by the replication SQL thread up to the point where the relay log ends. This can be useful when you want to pause execution to catch up with events already received from the source, when you want to perform administration on the replica but also ensure that it has processed all updates to a specific point. This method can also be used to pause event receipt on the replica while you conduct administration on the source. Stopping the I/O thread but permitting the SQL thread to run helps ensure that there is not a massive backlog of events to be executed when replication is started again.
