#### 21.6.15.42 The ndbinfo threads Table

The `threads` table provides information about threads running in the `NDB` kernel.

The `threads` table contains the following columns:

* `node_id`

  ID of the node where the thread is running

* `thr_no`

  Thread ID (specific to this node)

* `thread_name`

  Thread name (type of thread)

* `thread_description`

  Thread (type) description

##### Notes

Sample output from a 2-node example cluster, including thread descriptions, is shown here:

```sql
mysql> SELECT * FROM threads;
+---------+--------+-------------+------------------------------------------------------------------+
| node_id | thr_no | thread_name | thread_description                                               |
+---------+--------+-------------+------------------------------------------------------------------+
|       5 |      0 | main        | main thread, schema and distribution handling                    |
|       5 |      1 | rep         | rep thread, asynch replication and proxy block handling          |
|       5 |      2 | ldm         | ldm thread, handling a set of data partitions                    |
|       5 |      3 | recv        | receive thread, performing receive and polling for new receives |
|       6 |      0 | main        | main thread, schema and distribution handling                    |
|       6 |      1 | rep         | rep thread, asynch replication and proxy block handling          |
|       6 |      2 | ldm         | ldm thread, handling a set of data partitions                    |
|       6 |      3 | recv        | receive thread, performing receive and polling for new receives |
+---------+--------+-------------+------------------------------------------------------------------+
8 rows in set (0.01 sec)
```

This table was added in NDB 7.5.2.
