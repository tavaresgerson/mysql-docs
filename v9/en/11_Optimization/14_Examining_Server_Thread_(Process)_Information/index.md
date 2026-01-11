## 10.14 Examining Server Thread (Process) Information

10.14.1 Accessing the Process List

10.14.2 Thread Command Values

10.14.3 General Thread States

10.14.4 Replication Source Thread States

10.14.5 Replication I/O (Receiver) Thread States

10.14.6 Replication SQL Thread States

10.14.7 Replication Connection Thread States

10.14.8 NDB Cluster Thread States

10.14.9 Event Scheduler Thread States

To ascertain what your MySQL server is doing, it can be helpful to examine the process list, which indicates the operations currently being performed by the set of threads executing within the server. For example:

```
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 5
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

Threads can be killed with the `KILL` statement. See Section 15.7.8.4, “KILL Statement”.
