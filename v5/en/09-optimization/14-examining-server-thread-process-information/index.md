## 8.14 Examining Server Thread (Process) Information

8.14.1 Accessing the Process List

8.14.2 Thread Command Values

8.14.3 General Thread States

8.14.4 Query Cache Thread States

8.14.5 Replication Source Thread States

8.14.6 Replication Replica I/O Thread States

8.14.7 Replication Replica SQL Thread States

8.14.8 Replication Replica Connection Thread States

8.14.9 NDB Cluster Thread States

8.14.10 Event Scheduler Thread States

To ascertain what your MySQL server is doing, it can be helpful to examine the process list, which indicates the operations currently being performed by the set of threads executing within the server. For example:

```sql
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 1
   User: event_scheduler
   Host: localhost
     db: NULL
Command: Daemon
   Time: 2756681
  State: Waiting on empty queue
   Info: NULL
*************************** 2. row ***************************
     Id: 20
   User: me
   Host: localhost:52943
     db: test
Command: Query
   Time: 0
  State: starting
   Info: SHOW PROCESSLIST
```

Threads can be killed with the `KILL` statement. See Section 13.7.6.4, “KILL Statement”.
